import { Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { User } from './User';

export class Profile extends BaseModel {
  avatarUrl?: string;

  bannerUrl?: string;

  bio?: string;

  @Type(() => Date)
  createdAt: Date;

  displayName: string;

  id: string;

  @Type(() => Date)
  updatedAt: Date;

  @Type(() => User)
  user: User;

  userId: string;

  websiteUrl?: string;
}
