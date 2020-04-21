import { Injectable } from '@angular/core';
import { IRecipeDetailsModel } from '../models/IRecipeModel';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  public currRecipe: IRecipeDetailsModel = {
    title: ''
  };
  public newRecipe: IRecipeDetailsModel;
  public recipes: IRecipeDetailsModel[];
  constructor() { }
}
