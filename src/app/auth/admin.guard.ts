import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private notifications: NotificationsService,
    private authService: AuthService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAdmin) {
      return true;
    }
    else {
      this.createNotification('Нема прав доступу', 'Необхідна увійти в обліковий запис');
      this.router.navigate(['/user/login']);
      return false;
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
