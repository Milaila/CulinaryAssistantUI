import { Component, OnInit } from '@angular/core';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss']
})
export class MyRecipesComponent implements OnInit {
  recipes: IRecipeGeneralModel[] = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationsService,
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
    // if (!this.authService.isAuthorized) {
    //   this.router.navigate(['/404']);
    // }

    if (this.authService.isAdmin) {
      this.serverService.getDefaultRecipes().pipe(take(1)).subscribe(
        recipes => this.recipes = recipes,
        _ => this.createNotification('Помилка під час завантаження рецептів')
      );
    }
    else {
      this.serverService.getMyRecipes().pipe(take(1)).subscribe(
        recipes => this.recipes = recipes,
        _ => this.createNotification('Помилка під час завантаження рецептів')
      );
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
