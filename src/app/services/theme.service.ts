import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeChanged$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  themes: ITheme[] = [
    { label: '1*', code: 'green-700-light-green' },
    { label: '2*', code: 'light-green-700-lime' },
    { label: '3*', code: 'orange-800-yellow' },
    { label: '4*', code: 'teal-700-light-green' },
    { label: '5*', code: 'cyan-900-lime' },
    { label: '6*', code: 'cyan-800-amber' },

    { label: '', code: 'lime-900-yellow' },
    { label: '', code: 'yellow-500-orange' },
    { label: '', code: 'blue-grey-500-pink' },
    { label: '', code: 'cyan-900-yellow' },
    { label: '', code: 'teal-900-green' },
    { label: '', code: 'green-800-amber' },
    { label: '', code: 'purple-300-lime' },
    { label: '', code: 'pink-700-yellow' },
    { label: '', code: 'deep-orange-A700-amber' },
    { label: '', code: 'brown-800-orange' },
    { label: '', code: 'pink-900-amber' },

    // { label: '', code: 'cyan-700-amber' },
    // { label: '', code: 'purple-800-amber' },13
    // { label: '', code: 'red-A700-amber' },
    // { label: '-', code: 'blue-800-yellow' },
    // { label: '-', code: 'light-blue-700-yellow' },
    // { label: '-', code: 'indigo-700-blue-grey' },
    // { label: '-', code: 'pink-900-blue-grey' },
    // { label: '-', code: 'red-700-yellow' },
    // { label: '-', code: 'red-900-brown' },
    // { label: '-', code: 'yellow-600-deep-orange' },
    // { label: '-', code: 'brown-700-deep-orange' },
    // { label: '-', code: 'brown-900-lime' },
    // { label: '', code: 'green-900-lime' },
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

  convertToThemeClass(themeCode?: string): string {
    return themeCode ? 'theme-' + themeCode : 'theme';
  }
}

export interface ITheme {
  label: string;
  code: string;
}
