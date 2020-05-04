import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthUtils } from '../shared/auth-utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AuthUtils.isAuthorized) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${AuthUtils.getToken()}`)
      });
      return next.handle(clonedReq).pipe(
        tap(
          success => {},
          err => {
            if (err.status === 401) {
              alert('Token expired!');
              AuthUtils.clearToken();
              this.router.navigate(['/user/login']);
            }
          }
        )
      );
    }
    return next.handle(req.clone());
  }
}
