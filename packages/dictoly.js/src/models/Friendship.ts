import { Expose, Type } from 'class-transformer';

import { FriendRequestStatus } from '~/enums';

import { BaseModel } from './BaseModel';
import { User } from './User';

export class Friendship extends BaseModel {
  @Expose()
  @Type(() => User)
  from?: User;

  @Expose()
  fromId: string;

  @Expose()
  status: FriendRequestStatus;

  @Expose()
  @Type(() => User)
  to?: User;

  @Expose()
  toId: string;
}
