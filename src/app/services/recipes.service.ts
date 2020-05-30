import { Injectable, ChangeDetectorRef } from '@angular/core';
import { IRecipeModel, IRecipeGeneralModel } from '../models/server/recipe-models';
import { ServerHttpService } from './server-http.service';
import { take } from 'rxjs/operators';
import { RecipeSort } from '../recipes/recipes-sort-type';

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

  // set recipes(value: IRecipeGeneralModel[]) {
  //   this.isUpdated = value ? true : false;
  //   this.currRecipes = this.resultRecipes = value;
  // }

  // searchByRecipeName(name: string) {
  //   const check = new RegExp(name, 'i');
  //   this.currRecipes = this.resultRecipes?.filter(r => check.test(r.title));
  // }

  sortRecipes(recipes: IRecipeGeneralModel[], sort: RecipeSort = this.currSortType): IRecipeGeneralModel[] {
    switch (sort) {
      case 'TITLE_ASC': return this.sortRecipesByTitle(recipes, true);
      case 'TITLE_DESC': return this.sortRecipesByTitle(recipes, false);
      case 'DATE_ASC': return this.sortRecipesByDate(recipes, true);
      case 'DATE_DESC': return this.sortRecipesByDate(recipes, false);
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
}
