import { IImageModel } from './IImageModel';

export interface IRecipeModel extends IModel {
  title: string;
  description?: string;
  imageId?: number;
}

export interface IRecipeDetailsModel extends IRecipeModel {
  author?: string;
  authorId?: number;
  image?: IImageModel;
  ingredients?: IIngredientModel[];
  steps?: IRecipeStepModel[];
  tags?: ITagModel[];
  calories?: number;
  portions?: number;
  duration?: number;
}

export interface IRecipeStepModel extends IModel {
  title?: string;
  description?: string;
  orderNumber: number;
  imageId?: number;
  image?: IImageModel;
}

export interface IProductModel extends IModel {
  name: string;
  description?: string;
  imageId?: number;
  isCategory?: boolean;
}

export interface IIngredientModel extends IModel {
  productId?: number;
  product?: IProductModel;
  note?: string;
  weight: number;
  necessity?: boolean;
}

export interface IProductDetailsModel extends IProductModel {
  calories?: number;
  fats?: number;
  carbohydrates?: number;
  squirrels?: number;
  water?: number;
  ash?: number;
  sugar?: number;
  cellulose?: number;
  starch?: number;
  cholesterol?: number;
  transFats?: number;
  image?: IImageModel;
}

export interface ITagModel extends IModel {
  tag: string;
}

export interface IModel {
  id?: number;
}
