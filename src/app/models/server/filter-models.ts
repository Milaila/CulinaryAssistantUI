import { IModel } from './base-model';
import { IProductModel, IProduct, IProductGeneralModel, IProductDetails } from './product-model';
import { IImageModel } from './image-model';

export interface IFilterModel extends IFilterDetails, IFilterGeneralModel {
}

export interface IFilter extends IFilterModel {
  loadDetails?: boolean;
}

export interface IFilterDetails {
  recipeTitle?: string;
  onlyProducts?: boolean; // REQUIRED!
  byAvailableProducts?: boolean; // REQUIRED!
  authorId?: number;
  minDuration?: number;
  maxDuration?: number;
  minCalories?: number;
  maxCalories?: number;
  ingredients?: IFilterIngredientModel[];
  tags?: IFilterTagModel[];
}

export interface IFilterGeneralModel extends IModel {
  filterTitle: string;
  description?: string;
  isDefault: boolean;
}

export interface IFilterTagModel extends IModel {
  necessity: boolean;
  tag: string;
}

export interface IFilterIngredientModel extends IModel {
  necessity: boolean;
  productId: number;
}

export interface IFilterProduct extends IProductModel {
  necessity: ProductNecessity;
}

export interface IFilterGeneralProduct extends IProductGeneralModel {
  necessity: ProductNecessity;
}

export enum ProductNecessity {
  Undefined = 1,
  NotRequired = 2,
  Required = 3,
}
