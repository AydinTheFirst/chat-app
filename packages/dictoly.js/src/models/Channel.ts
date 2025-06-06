import { Expose, Type } from 'class-transformer';

import { ChannelType } from '~/enums';

import { BaseModel } from './BaseModel';
import { InviteLink } from './InviteLink';
import { Message } from './Message';
import { User } from './User';

export class Channel extends BaseModel {
  @Expose()
  description?: string;

  @Expose()
  @Type(() => InviteLink)
  inviteLinks?: InviteLink[];

  @Expose()
  isPublic: boolean;

  @Expose()
  @Type(() => Message)
  messages?: Message[];

  @Expose()
  name: string;

  @Expose()
  @Type(() => User)
  owner?: User;

  @Expose()
  ownerId?: string;

  @Expose()
  type: ChannelType;

  @Expose()
  @Type(() => User)
  users?: User[];
}
