import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IMenuItem } from '../../models/else/menu-item';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { IMenuItemsGroup } from '../../models/else/menu-items-group';
import { AuthService } from '../../services/auth.service';
import { IProfile, IProfileModel } from '../../models/server/profile-models';
import { ServerHttpService } from '../../services/server-http.service';
import { switchMap } from 'rxjs/operators';
import { ThemeService, ITheme } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  menuItems: IMenuItemsGroup[];
  currProfile: IProfileModel;
  themes: ITheme[];
  @Output()
  toggleDrawer = new EventEmitter();

  constructor(
    private router: Router,
    public authService: AuthService,
    public server: ServerHttpService,
    public theme: ThemeService,
    private route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.themes = this.theme.themes;
    // this.subscriptions.add(this.authService.tokenChanged$.pipe(
    //   switchMap(token => {
    //     if (token) {
    //       return this.server.getCurrentProfile();
    //     }
    //     return of(null);
    //   }),
    // ).subscribe(profile => this.currProfile = profile));
    // this.menuItems = this.createMenuItems();
  }

  get userName(): string {
    return this.authService.name;
  }

  changeTheme(code: string) {
    this.theme.changeTheme(code);
  }

  get currThemeCode(): string {
    return this.theme.themeCode;
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

  logout() {
    this.authService.logout();
  }

  private createMenuItems(): IMenuItemsGroup[] {
    return [
      {
        mainItem: {
          label: 'Обліковий запис',
          routerLink: '/user/login',
        },
        subItems: [
          {
            label: 'Вхід в обліковий запис',
            visible: () => this.authService.isAuthorized,
            routerLink: '/profiles/user/login',
          },
          {
            label: 'Реєстрація',
            visible: () => this.authService.isAuthorized,
            routerLink: '/profiles/user/registration',
          },
          // {
          //   label: 'Мій профіль',
          //   visible: () => this.authService.isAuthorized,
          //   // routerLink: '/profiles/my',
          // },
        ],
      },
      {
        mainItem: {
          label: 'Продукти',
          // routerLink: '',
        },
        subItems: [
          {
            label: 'Cписок',
            // routerLink: '',
          },
          {
            label: 'Редагування',
            visible: () => this.authService.isAuthorized,
            // routerLink: '',
          },
        ],
      },
      {
        mainItem: {
          label: 'Рецепти',
          routerLink: '',
        },
        subItems: [
          {
            label: 'Мої рецепти',
            visible: () => this.authService.isAuthorized,
            // routerLink: '',
          },
          {
            label: 'Мої фільтри',
            visible: () => this.authService.isAuthorized,
            // routerLink: '',
          },
          {
            label: 'Створення рецепту',
            visible: () => this.authService.isAuthorized,
            routerLink: '/recipes/new',
          },
          {
            label: 'Пошук рецептів',
            // routerLink: '',
          },
        ],
      },
    ];
  }
}
