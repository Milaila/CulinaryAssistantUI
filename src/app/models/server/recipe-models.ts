import { IModel } from './base-model';
import { IProductModel } from './product-model';
import { IImageModel } from './image-model';

export interface IRecipeModel extends IRecipeGeneralModel, IRecipeDetails {
}

export interface IRecipe extends IRecipeGeneralModel {
  details?: IRecipeDetails;
}

export interface IRecipeDetails {
  image?: IImageModel;
  calories?: number;
  portions?: number;
  duration?: number;
  ingredients?: IIngredientModel[];
  ingredientsDescription?: string;
  steps?: IRecipeStepModel[];
  tags?: IRecipeTagModel[];
}

export interface IRecipeGeneralModel extends IModel {
  title: string;
  description?: string;
  time?: Date;
  authorId?: number;
  imageId?: number;
}

export interface IRecipeStepModel extends IModel {
  title?: string;
  description?: string;
  orderNumber?: number;
  imageId?: number;
  image?: IImageModel;
}

export interface IRecipeTagModel extends IModel {
  tag: string;
}

export interface IIngredientModel extends IModel {
  productId: number;
  product?: IProductModel;
  note?: string;
  weight: number;
  necessity: boolean;
}
