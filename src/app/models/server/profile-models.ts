import { IModel } from './base-model';
import { IImageModel } from './image-model';

export interface IProfileModel extends IProfileGeneralModel, IProfileDetails {
}

// export interface IProfile extends IProfileGeneralModel {
//   details?: IProfileDetails;
// }

export interface IProfile extends IProfileModel {
  loadDetails?: boolean;
}

export interface IProfileGeneralModel extends IModel {
  displayName: string;
  role?: string;
}

export interface IProfileDetails {
  email?: string;
  fullName?: string;
  birthDay?: Date;
  description?: string;
  avatarId?: number;
  avatar?: IImageModel;
}
