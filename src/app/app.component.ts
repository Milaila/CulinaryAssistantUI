import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { ThemePalette } from '@angular/material/core';
import { IMenuItem } from './models/else/menu-item';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { IConfirmData } from './models/else/confirm-data';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

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
    public authService: AuthService,
    private dialog: MatDialog,
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

  public logout() {
    const data: IConfirmData = {
      question: `Вийти з облікового запису?`,
      confirmation: 'Вийти',
      cancellation: 'Скасувати'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '350px', data });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.authService.logout();
      }
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
        label: 'Керувати рецептами',
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
        label: 'Змінити пароль',
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
