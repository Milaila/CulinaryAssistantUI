import { IModel } from './base-model';
import { IProductModel } from './product-model';
import { IImageModel } from './image-model';
import { Observable } from 'rxjs';

export interface IRecipeModel extends IRecipeGeneralModel, IRecipeDetails {
}

export interface IRecipe extends IRecipeModel {
  loadDetails?: boolean;
  // details?: IRecipeDetails;
}

export interface IRecipeDetails {
  image?: IImageModel;
  calories?: number;
  portions?: number;
  duration?: number;
  authorName?: string;
  servingWeight?: number;
  ingredients?: IIngredientModel[];
  ingredientsDescription?: string;
  steps?: IRecipeStepModel[];
  tags?: IRecipeTagModel[];
}

export interface IRecipeModelView extends IRecipeGeneralModel {
  calories?: number;
  authorName?: string;
  servingWeight?: number;
  portions?: number;
  duration?: number;
  imageSrc$?: Observable<string>;
  ingredients?: IIngredientModel[];
  ingredientsDescription?: string;
  steps?: IRecipeStepModelView[];
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

export interface IRecipeStepModelView extends IModel {
  imageSrc$?: Observable<string>;
  title?: string;
  description?: string;
  orderNumber?: number;
  imageId?: number;
}

export interface IRecipeTagModel extends IModel {
  tag: string;
}

export interface IIngredientModel extends IModel {
  productId: number;
  product?: IProductModel;
  title?: string;
  note?: string;
  weight?: number;
  weightInGrams?: number;
  weightMeasurement?: string;
  necessity: boolean;
}
