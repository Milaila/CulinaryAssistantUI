import { Component, OnInit } from '@angular/core';
import { IRecipeGeneralModel } from 'src/app/models/server/recipe-models';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

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
    private serverService: ServerHttpService,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthorized) {
      this.router.navigate(['/404']);
    }

    this.serverService.getMyRecipes().pipe(take(1)).subscribe(
      recipes => this.recipes = recipes,
      _ => alert('Error during getting current recipes')
    );
  }

}
