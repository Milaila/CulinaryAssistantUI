import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
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
              alert('Token expired!');
              this.authService.clearToken();
              this.router.navigate(['/user/login']);
            }
          }
        )
      );
    }
    return next.handle(req.clone());
  }
}
