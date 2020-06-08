import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { IMenuItemsGroup } from '../../models/else/menu-items-group';
import { AuthService } from '../../services/auth.service';
import { IProfileModel } from '../../models/server/profile-models';
import { ServerHttpService } from '../../services/server-http.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ITheme } from 'src/app/models/else/theme';
import { MatDialog } from '@angular/material/dialog';
import { IConfirmData } from 'src/app/models/else/confirm-data';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    public authService: AuthService,
    public server: ServerHttpService,
    public theme: ThemeService,
    public dialog: MatDialog,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.themes = this.theme.themes;
  }

  get userName(): string {
    return this.authService.name;
  }

  changeTheme(code: string) {
    this.theme.changeTheme(code);
  }

  getThemeByCode(code: string): string {
    return this.theme.convertToThemeClass(code);
  }

  get currThemeCode(): string {
    return this.theme.themeCode;
  }

  get isAuthorized(): boolean {
   return this.authService.isAuthorized;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  logout() {
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
}
