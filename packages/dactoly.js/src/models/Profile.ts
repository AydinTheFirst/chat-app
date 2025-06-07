import { Expose, Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { User } from './User';

export class Profile extends BaseModel {
  @Expose()
  avatarUrl?: string;

  @Expose()
  bannerUrl?: string;

  @Expose()
  bio?: string;

  @Expose()
  displayName: string;

  @Expose()
  @Type(() => User)
  user?: User;

  @Expose()
  userId: string;

  @Expose()
  websiteUrl?: string;
}
