import { IModel } from './base-model';

export interface IImageModel extends IModel {
  title?: string;
  data: string;
}
