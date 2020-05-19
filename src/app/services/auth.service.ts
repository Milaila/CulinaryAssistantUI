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
    return !!localStorage.getItem('admin') && this.isAuthorized;
  }

  get name(): string {
    return localStorage.getItem('name');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    if (token) {
      localStorage.setItem('token', token);
    }
    else {
      localStorage.removeItem('token');
    }
    this.tokenChanged$.next(token);
  }

  setName(name: string): void {
    if (name) {
      localStorage.setItem('name', name);
    }
    else {
      localStorage.removeItem('token');
    }
    this.tokenChanged$.next(name);
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
    this.setName(model?.displayName);
  }

  logout(): void {
    this.clearToken();
    localStorage.removeItem('admin');
    localStorage.removeItem('name');
  }
}
