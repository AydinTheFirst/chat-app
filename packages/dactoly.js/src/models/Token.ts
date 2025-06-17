import { Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { User } from './User';

export class Token extends BaseModel {
  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  expiresAt: Date;

  id: string;

  token: string;

  updatedAt: Date;

  @Type(() => User)
  user: User;

  userId: string;
}
