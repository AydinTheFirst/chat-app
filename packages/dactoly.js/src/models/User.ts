import { Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { Profile } from './Profile';

export class User extends BaseModel {
  @Type(() => Profile)
  profile?: Profile;

  username: string;
}
