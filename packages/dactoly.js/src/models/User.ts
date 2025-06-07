import { Expose, Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { Profile } from './Profile';

export class User extends BaseModel {
  @Expose()
  @Type(() => Profile)
  profile?: Profile;

  @Expose()
  username: string;
}
