import { Injectable } from '@angular/core';
import { IRecipeTagModel, IRecipeModel } from '../models/server/recipe-models';
import { IModel } from '../models/server/base-model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  public currRecipe: IRecipeModel = {
    id: 0,
    title: ''
  };
  public newRecipe: IRecipeModel;
  public recipes: IRecipeModel[];
  constructor() { }
}
