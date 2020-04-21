import { IModel } from './IRecipeModel';

export interface IImageModel extends IModel {
  id?: number;
  title?: string;
  data: string;
}
