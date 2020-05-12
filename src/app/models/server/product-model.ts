import { IModel } from './base-model';
import { IImageModel } from './image-model';
import { Observable } from 'rxjs';

export interface IProductManageModel extends IProductGeneralModel, IProductDetails {
  subcategories?: IProductRelationModel[];
  categories?: IProductRelationModel[];
}

export interface IProductModel extends IProductGeneralModel, IProductDetails {
  subcategories?: number[];
  categories?: number[];
}

export interface IProduct extends IProductModel {
  // loadDetails?: boolean;
  loadDetails?: boolean;
  subcategoriesModels?: IProductRelationModel[];
  categoriesModels?: IProductRelationModel[];
}

export interface IProductGeneralModel extends IModel {
  name: string;
  description?: string;
  imageId?: number;
}

export interface IProductDetails {
  calories?: number;
  fats?: number;
  carbohydrates?: number;
  squirrels?: number;
  water?: number;
  ash?: number;
  sugar?: number;
  cellulose?: number;
  starch?: number;
  transFats?: number;
  cholesterol?: number;
  image?: IImageModel;
}

export interface IProductRelationModel extends IModel {
  productId: number;
}

export interface IProductName {
  id: number;
  name: string;
}

export interface IProductView extends IProductModel {
  imageSrc$?: Observable<string>;
  categoryNames?: IProductName[];
  subcategoryNames?: IProductName[];
}
