import { Type } from 'class-transformer';

import { ChannelType } from '~/enums';

import { BaseModel } from './BaseModel';
import { InviteLink } from './InviteLink';
import { Message } from './Message';
import { User } from './User';

export class Channel extends BaseModel {
  description?: string;

  @Type(() => InviteLink)
  inviteLinks?: InviteLink[];

  isPublic: boolean;

  @Type(() => Message)
  lastMessage?: Message;

  lastMessageId?: string;

  @Type(() => Message)
  messages?: Message[];

  name: string;

  @Type(() => User)
  owner?: User;

  ownerId?: string;

  type: ChannelType;

  @Type(() => User)
  users?: User[];
}
