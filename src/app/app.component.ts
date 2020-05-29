import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { ThemePalette } from '@angular/material/core';
import { IMenuItem } from './models/else/menu-item';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isMenuCollapsed = false;
  title = 'Culinary-Assistant';
  prevTheme: string;
  opened = false;
  menuItems: IMenuItem[];

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    // this.renderer.addClass(document.body, this.themeService.themeClass);
    this.themeControl();
    this.initMenu();
  }

  private themeControl() {
    this.themeService.themeChanged$.subscribe(_ => {
      const theme = this.themeService.themeClass;
      if (this.prevTheme) {
        this.renderer.removeClass(document.body, this.prevTheme);
      }
      this.prevTheme = theme;
      this.renderer.addClass(document.body, theme);
    });
  }

  private initMenu() {
    this.menuItems = [
      {
        label: 'Пошук рецептів',
        routerLink: '/recipes/search',
      },
      {
        label: 'Продукти',
        routerLink: '/products/list',
      },
      {
        label: 'Мої рецепти',
        visible: () => this.authService.isAuthorized,
        routerLink: '/recipes/my',
      },
      {
        label: 'Створити продукт',
        visible: () => this.authService.isAdmin,
        routerLink: '/products/new'
      },
      {
        label: 'Створити рецепт',
        visible: () => this.authService.isAuthorized,
        routerLink: '/recipes/new',
      },
      {
        label: 'Зміна паролю',
        visible: () => this.authService.isAuthorized,
        routerLink: '/profiles/user/changepassword',
      },
      {
        label: 'Вхід в обліковий запис',
        visible: () => !this.authService.isAuthorized,
        routerLink: '/profiles/user/signin',
      },
      {
        label: 'Реєстрація',
        routerLink: '/profiles/user/signup',
      },
    ];
  }

}
