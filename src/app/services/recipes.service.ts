import { Injectable, ChangeDetectorRef } from '@angular/core';
import { IRecipeModel, IRecipeGeneralModel } from '../models/server/recipe-models';
import { ServerHttpService } from './server-http.service';
import { take } from 'rxjs/operators';
import { RecipeSort } from '../recipes/recipes-sort.enum';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private resultRecipes: IRecipeGeneralModel[];
  currRecipes: IRecipeGeneralModel[];
  isUpdated = false;
  private currSortType = RecipeSort.TitleAsc;

  constructor(
    private serverService: ServerHttpService,
  ) { }

  setRecipes(value: IRecipeGeneralModel[], sort: RecipeSort = this.currSortType) {
    this.isUpdated = value ? true : false;
    this.resultRecipes = value;
    this.currRecipes = (sort && value) ? this.sortRecipes(value, sort) : value;
  }

  set sortType(value: RecipeSort) {
    this.sortCurrentRecipes(value);
  }

  get sortType(): RecipeSort {
    return this.currSortType;
  }

  get recipes(): IRecipeGeneralModel[] {
    return this.resultRecipes;
  }

  sortRecipes(recipes: IRecipeGeneralModel[], sort: RecipeSort = this.currSortType): IRecipeGeneralModel[] {
    switch (sort) {
      case RecipeSort.TitleAsc: return this.sortRecipesByTitle(recipes, true);
      case RecipeSort.TitleDesc: return this.sortRecipesByTitle(recipes, false);
      case RecipeSort.DateAsc: return this.sortRecipesByDate(recipes, true);
      case RecipeSort.DateDesc: return this.sortRecipesByDate(recipes, false);
      default: return recipes;
    }
  }

  sortCurrentRecipes(sort: RecipeSort): void {
    this.currSortType = sort;
    this.currRecipes = [ ...(this.sortRecipes(this.currRecipes, sort) || []) ];
  }

  sortRecipesByTitle(newRecipes: IRecipeGeneralModel[], asc = true): IRecipeGeneralModel[] {
    const recipes = newRecipes?.sort((x, y) => {
      if (!x.title) {
        return 1;
      }
      return x.title?.localeCompare(y.title);
    });
    return asc ? recipes : recipes?.reverse();
  }

  sortRecipesByDate(newRecipes: IRecipeGeneralModel[], asc = true): IRecipeGeneralModel[] {
    const recipes = newRecipes?.sort((x, y) => {
      if (!x.time) {
        return 1;
      }
      return x.time > y.time ? 1 : -1;
    });
    return asc ? recipes : recipes?.reverse();
  }

  clearRecipes() {
    this.isUpdated = false;
    // this.currRecipes = null;
    this.resultRecipes = null;
  }

  filterRecipesByTitle(name: string) {
    const check = new RegExp(name, 'i');
    this.currRecipes = this.resultRecipes?.filter(r => check.test(r.title));
    this.sortType = RecipeSort.TitleAsc;
  }

  deleteRecipe(recipeId: number) {
    const indexRes = this.resultRecipes?.findIndex(x => x.id === recipeId);
    if (indexRes > -1) {
      this.resultRecipes.splice(indexRes, 1);
    }
    else {
      return;
    }
    const indexCurr = this.currRecipes?.findIndex(x => x.id === recipeId);
    if (indexCurr > -1) {
      this.currRecipes.splice(indexCurr, 1);
    }
  }
}
