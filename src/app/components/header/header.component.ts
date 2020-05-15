import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMenuItem } from 'src/app/models/else/menu-item';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { IMenuItemsGroup } from 'src/app/models/else/menu-items-group';
import { AuthService } from 'src/app/services/auth.service';
import { IProfile, IProfileModel } from 'src/app/models/server/profile-models';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();
  menuItems: IMenuItemsGroup[];
  currProfile: IProfileModel;

  constructor(
    private router: Router,
    public authService: AuthService,
    public server: ServerHttpService,
    private route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(this.authService.tokenChanged$.pipe(
      switchMap(token => {
        if (token) {
          return this.server.getCurrentProfile();
        }
        return of(null);
      }),
    ).subscribe(profile => this.currProfile = profile));
    // this.menuItems = this.createMenuItems();
  }

  // onClickItem(item: IMenuItem) {
  //   if (item?.click) {
  //     item.click();
  //   }
  //   if (item?.routerLink) {
  //     this.router.navigate([item.routerLink], { relativeTo: this.route });
  //   }
  // }

  get isAuthorized(): boolean {
   return this.authService.isAuthorized;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  // private createMenuItems(): IMenuItemsGroup[] {
  //   return [
  //     {
  //       mainItem: {
  //         label: 'Профіль',
  //         routerLink: '/user/login',
  //       },
  //       subItems: [
  //         {
  //           label: 'Вхід',
  //           visible: () => !this.authService.isAuthorized,
  //           routerLink: '/user/login',
  //         },
  //         {
  //           label: 'Реєстрація',
  //           visible: () => !this.authService.isAuthorized,
  //           routerLink: '/user/registration',
  //         },
  //         {
  //           label: 'Мій профіль',
  //           visible: () => this.authService.isAuthorized,
  //           // routerLink: '/profiles/my',
  //         },
  //         {
  //           label: 'Вихід',
  //           visible: () => this.authService.isAuthorized,
  //           click: () => this.authService.clearToken(), // TO DO: success alert
  //           // routerLink: '/user/login',
  //         },
  //       ],
  //     },
  //     {
  //       mainItem: {
  //         label: 'Продукти',
  //         // routerLink: '',
  //       },
  //       subItems: [
  //         {
  //           label: 'Cписок',
  //           // routerLink: '',
  //         },
  //         {
  //           label: 'Редагування',
  //           visible: () => this.authService.isAuthorized,
  //           // routerLink: '',
  //         },
  //       ],
  //     },
  //     {
  //       mainItem: {
  //         label: 'Рецепти',
  //         routerLink: '',
  //       },
  //       subItems: [
  //         {
  //           label: 'Мої рецепти',
  //           visible: () => this.authService.isAuthorized,
  //           // routerLink: '',
  //         },
  //         {
  //           label: 'Мої фільтри',
  //           visible: () => this.authService.isAuthorized,
  //           // routerLink: '',
  //         },
  //         {
  //           label: 'Створення рецепту',
  //           visible: () => this.authService.isAuthorized,
  //           routerLink: '/recipes/new',
  //         },
  //         {
  //           label: 'Пошук рецептів',
  //           // routerLink: '',
  //         },
  //       ],
  //     },
  //   ];
  // }

}
