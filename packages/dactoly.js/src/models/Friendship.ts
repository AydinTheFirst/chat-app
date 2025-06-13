import { Type } from 'class-transformer';

import { FriendRequestStatus } from '~/enums';

import { BaseModel } from './BaseModel';
import { User } from './User';

export class Friendship extends BaseModel {
  @Type(() => User)
  from?: User;

  fromId: string;

  status: FriendRequestStatus;

  @Type(() => User)
  to?: User;

  toId: string;
}
