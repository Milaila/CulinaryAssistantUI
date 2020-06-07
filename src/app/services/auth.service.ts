import { Injectable } from '@angular/core';
import { ISignInResponse } from '../models/server/sign-in-response-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly tokenChanged$: BehaviorSubject<string> = new BehaviorSubject(null);

  get isAuthorized(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
    return !!localStorage.getItem('admin') && this.isAuthorized;
  }

  set isAdmin(value: boolean) {
    if (value) {
      localStorage.setItem('admin', 'true');
    }
    else {
      localStorage.removeItem('admin');
    }
  }

  get name(): string {
    return localStorage.getItem('name');
  }

  set name(value: string) {
    if (value) {
      localStorage.setItem('name', value);
    }
    else {
      localStorage.removeItem('name');
    }
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  set token(value: string) {
    if (value) {
      localStorage.setItem('token', value);
    }
    else {
      localStorage.removeItem('token');
    }
    this.tokenChanged$.next(value);
  }

  get profileId(): number {
    return +localStorage.getItem('profileId');
  }

  set profileId(value: number) {
    if (value) {
      localStorage.setItem('profileId', value?.toString());
    }
    else {
      localStorage.removeItem('profileId');
    }
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this.tokenChanged$.next(null);
  }

  signIn(model: ISignInResponse) {
    this.isAdmin = model?.isAdmin;
    this.token = model?.token;
    this.name = model?.displayName;
    this.profileId = model?.profileId;
  }

  logout(): void {
    this.clearToken();
    this.isAdmin = null;
    this.name = null;
    this.profileId = null;
  }
}
