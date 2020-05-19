import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isMenuCollapsed = false;
  title = 'Culinary-Assistant';
  prevTheme: string;

  constructor(
    private renderer: Renderer2,
    private themeService: ThemeService
  ) {
    // this.renderer.addClass(document.body, this.themeService.themeClass);
    this.themeControl();
  }

  private themeControl() {
    this.themeService.themeChanged$.subscribe(_ => {
      const theme = this.themeService.themeClass;
      if (this.prevTheme) {
        this.renderer.removeClass(document.body, this.prevTheme);
      }
      this.prevTheme = theme;
      this.renderer.addClass(document.body, theme);
    });
  }
}
