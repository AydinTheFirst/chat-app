import { Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { User } from './User';

export class Application extends BaseModel {
  @Type(() => User)
  bot?: User;

  clientId: string;

  clientSecret: string;

  @Type(() => Date)
  createdAt: Date;

  description?: string;

  iconUrl?: string;

  id: string;

  name: string;

  @Type(() => User)
  owner: User;

  @Type(() => Date)
  updatedAt: Date;
}
