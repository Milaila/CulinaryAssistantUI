import { IMenuItem } from './menu-item';

export interface IMenuItemsGroup {
  mainItem: IMenuItem;
  subItems: IMenuItem[];
}
