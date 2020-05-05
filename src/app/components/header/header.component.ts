import { Component, OnInit } from '@angular/core';
import { IMenuItem } from 'src/app/models/else/menu-item';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMenuItemsGroup } from 'src/app/models/else/menu-items-group';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  subscriptions = new Subscription();
  menuItems: IMenuItemsGroup[];

  constructor(
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.menuItems = this.createMenuItems();
  }

  onClickItem(item: IMenuItem) {
    if (item?.click) {
      item.click();
    }
    if (item?.routerLink) {
      this.router.navigate([item.routerLink], { relativeTo: this.route });
    }
  }

  get isAuthorized(): boolean {
   return this.authService.isAuthorized;
  }

  private createMenuItems(): IMenuItemsGroup[] {
    return [
      {
        mainItem: {
          label: 'Профіль',
          routerLink: '/user/login',
        },
        subItems: [
          {
            label: 'Вхід',
            visible: () => !this.authService.isAuthorized,
            routerLink: '/user/login',
          },
          {
            label: 'Реєстрація',
            visible: () => !this.authService.isAuthorized,
            routerLink: '/user/registration',
          },
          {
            label: 'Мій профіль',
            visible: () => this.authService.isAuthorized,
            // routerLink: '/profiles/my',
          },
          {
            label: 'Вихід',
            visible: () => this.authService.isAuthorized,
            click: () => this.authService.clearToken(), // TO DO: success alert
            // routerLink: '/user/login',
          },
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
