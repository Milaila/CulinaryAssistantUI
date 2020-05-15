import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notifications: NotificationsService,
    private authService: AuthService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthorized) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.authService.getToken()}`)
      });
      return next.handle(clonedReq).pipe(
        tap(
          success => {},
          err => {
            if (err.status === 401) {
              this.createNotification('Час вичерпан', 'Авторизуйтесь знову');
              this.authService.logout();
              this.router.navigate(['/user/login']);
            } else if (err.status === 403) {
              this.createNotification('Сторінки не існує або нема прав доступу');
              this.router.navigate(['404']);
            }
          }
        )
      );
    }
    return next.handle(req.clone()).pipe(tap(
      success => {},
      err => {
        if (err.status === 401) {
          this.createNotification('Нема прав доступу', 'Необхідна авторизація');
          this.router.navigate(['/user/login']);
        }
      }
    ));
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
