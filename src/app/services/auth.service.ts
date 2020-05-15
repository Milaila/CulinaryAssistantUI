import { Injectable } from '@angular/core';
import { ISignInResponse } from '../models/server/sign-in-response-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly tokenChanged$: BehaviorSubject<string> = new BehaviorSubject(null);

  get isAuthorized(): boolean {
    return !!this.getToken();
  }

  get isAdmin(): boolean {
    return !!localStorage.getItem('admin');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenChanged$.next(token);
  }

  setIsAdmin(isAdmin: boolean): void {
    if (isAdmin) {
      localStorage.setItem('admin', 'true');
    }
    else {
      localStorage.removeItem('admin');
    }
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this.tokenChanged$.next(null);
  }

  signIn(model: ISignInResponse) {
    this.setIsAdmin(model?.isAdmin);
    this.setToken(model?.token);
  }

  logout(): void {
    this.clearToken();
    localStorage.removeItem('admin');
  }
}
