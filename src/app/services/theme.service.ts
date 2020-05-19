import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeChanged$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  themes: ITheme[] = [
    {
      label: 'sleep',
      code: 'sleep'
    },
    {
      label: 'default',
      code: 'default'
    },
    {
      label: 'first',
      code: '1'
    },
  ];

  changeTheme(themeCode: string) {
    localStorage.setItem('theme', themeCode);
    this.themeChanged$.next(this.convertToThemeClass(themeCode));
  }

  get themeClass(): string {
    return this.convertToThemeClass(this.themeCode);
  }

  get themeCode(): string {
    return localStorage.getItem('theme');
  }

  resetTheme() {
    localStorage.removeItem('theme');
    this.themeChanged$.next(this.convertToThemeClass());
  }

  private convertToThemeClass(themeCode?: string) {
    return themeCode ? 'theme-' + themeCode : 'theme';
  }
}

export interface ITheme {
  label: string;
  code: string;
}
