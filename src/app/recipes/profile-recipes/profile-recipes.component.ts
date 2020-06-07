import { Component, OnInit, OnDestroy } from '@angular/core';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { take, catchError } from 'rxjs/operators';
import { of, combineLatest, Subscription } from 'rxjs';
import { IProfileModel } from 'src/app/models/server/profile-models';

@Component({
  selector: 'app-profile-recipes',
  templateUrl: './profile-recipes.component.html',
  styleUrls: ['./profile-recipes.component.scss']
})
export class ProfileRecipesComponent implements OnInit, OnDestroy {
  recipes: IRecipeGeneralModel[] = null;
  profile: IProfileModel;
  isRecipeCtrl: boolean;
  readonly subs = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notifications: NotificationsService,
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
    this.subs.add(this.route.params?.subscribe(params => {
      this.isRecipeCtrl = false;
      const num = +params.id;
      if (num > 0 && num !== this.authService.profileId) {
        this.initProfileRecipes(num);
        return;
      }
      else if (this.authService.isAuthorized) {
        this.initOwnRecipes();
        return;
      }
      this.router.navigate(['404']);
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private initProfileRecipes(id: number) {
    this.subs.add(this.serverService.getProfileById(id).subscribe(
      profile => this.profile = profile,
      error => this.router.navigate(['404'])
    ));
    this.subs.add(this.serverService.getRecipesByProfileId(id).pipe(
      take(1),
      catchError(() => {
        this.createNotification('Помилка під час завантаження рецептів');
        return of([]);
      })
    ).subscribe(recipes => this.recipes = recipes));
    return;
  }

  private initOwnRecipes() {
    this.isRecipeCtrl = true;
    const myRecipes$ = this.serverService.getMyRecipes().pipe(
      take(1),
      catchError(() => {
        this.createNotification('Помилка під час завантаження власних рецептів');
        return of([]);
      })
    );
    if (this.authService.isAdmin) {
      const defaultRecipes$ = this.serverService.getDefaultRecipes().pipe(
        take(1),
        catchError(() => {
          this.createNotification('Помилка під час завантаження стандартних рецептів');
          return of([]);
        })
      );
      this.subs.add(combineLatest([defaultRecipes$, myRecipes$]).subscribe(([admin, my]) => {
        this.recipes = admin ? (my || [])?.concat(admin) : my;
      }));
    }
    else {
      this.subs.add(myRecipes$.subscribe(recipes => this.recipes = recipes));
    }
  }

  get pageTitle(): string {
    return this.isRecipeCtrl
      ? 'Керування рецептами'
      : `Рецепти ©${this.profile?.displayName || this.profile?.fullName}`;
  }

  get profileName(): string {
    return this.profile?.displayName || this.profile?.fullName;
  }

  createNotification(title: string, content: string = '', type = NotificationType.Error) {
    this.notifications.create(title, content, type, {
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }
}
