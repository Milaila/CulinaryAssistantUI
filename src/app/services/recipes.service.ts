import { Injectable } from '@angular/core';
import { IRecipeModel, IRecipeGeneralModel } from '../models/server/recipe-models';
import { ServerHttpService } from './server-http.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private resultRecipes: IRecipeGeneralModel[];
  // private currRecipes: IRecipeGeneralModel[];
  isUpdated = false;

  constructor(
    private serverService: ServerHttpService
  ) { }

  set recipes(value: IRecipeGeneralModel[]) {
    this.isUpdated = value ? true : false;
    this.resultRecipes = this.sortRecipes(value);
  }

  get recipes(): IRecipeGeneralModel[] {
    return this.resultRecipes;
  }

  // searchByRecipeName(name: string) {
  //   const check = new RegExp(name, 'i');
  //   this.currRecipes = this.resultRecipes?.filter(r => check.test(r.title));
  // }

  sortRecipes(newRecipes: IRecipeGeneralModel[]): IRecipeGeneralModel[] {
    return newRecipes?.sort((x, y) => {
      if (!x.title) {
        return 1;
      }
      return x.title > y.title ? 1 : -1;
    });
  }

  // updateRecipes() {
  //   this.serverService.getRecipes().pipe(take(1)).subscribe(
  //     recipes => this.currRecipes = this.resultRecipes = recipes
  //     // _ => alert('Error during getting recipes')
  //   );
  // }

  clearRecipes() {
    this.isUpdated = false;
    // this.currRecipes = null;
    this.resultRecipes = null;
  }
}
