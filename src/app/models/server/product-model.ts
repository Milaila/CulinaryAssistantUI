import { IModel } from './base-model';
import { IImageModel } from './image-model';

export interface IProductModel extends IProductRelations, IProductGeneralModel, IProductDetails {
}

export interface IProduct extends IProductGeneralModel {
  details?: IProductDetails;
  relations?: IProductRelations;
}

export interface IProductRelations {
  subcategories?: number[] | IProductRelationModel[];
  categories?: number[] | IProductRelationModel[];
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

// export interface IProductModel extends IModel {
//   name: string;
//   description: string;
//   imageId: number;
// }

// export interface IProductComposition {
//   calories: number;
//   fats: number;
//   carbohydrates: number;
//   squirrels: number;
//   water: number;
//   ash: number;
//   sugar: number;
//   cellulose: number;
//   starch: number;
//   transFats: number;
//   cholesterol: number;
// }

// export interface IProductDetailsModel extends IProductModel, IProductComposition {
//   subcategories: number[];
//   categories: number[];
// }

// export interface IProductFullDetailsModel extends IProductModel, IProductComposition {
//   subcategories: IProductRelationModel[];
//   categories: IProductRelationModel[];
//   image: IImageModel;
// }
