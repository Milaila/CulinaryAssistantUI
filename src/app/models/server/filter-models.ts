import { IModel } from './base-model';
import { IProductModel } from './product-model';
import { IImageModel } from './image-model';

export interface IFilterModel extends IFilterDetails, IFilterGeneralModel {
}

export interface IFilter extends IFilterGeneralModel {
  details?: IFilterDetails;
}

export interface IFilterDetails {
  recipeTitle: string;
  onlyProducts: boolean;
  byAvailableProducts: boolean;
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
