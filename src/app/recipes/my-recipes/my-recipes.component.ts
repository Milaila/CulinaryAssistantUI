import { Component, OnInit } from '@angular/core';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.service';
import { Router } from '@angular/router';
import { take, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { of, combineLatest } from 'rxjs';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss']
})
export class MyRecipesComponent implements OnInit {
  recipes: IRecipeGeneralModel[] = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationsService,
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
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
      combineLatest([defaultRecipes$, myRecipes$]).subscribe(([admin, my]) => {
        this.recipes = admin ? (my || [])?.concat(admin) : my;
      });
    }
    else {
      myRecipes$.pipe(take(1)).subscribe(recipes => this.recipes = recipes);
    }
  }

  createNotification(title: string, content: string = '', type = NotificationType.Error) {
    this.notifications.create(title, content, type, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }
}
