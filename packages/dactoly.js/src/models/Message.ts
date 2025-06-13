import { Type } from 'class-transformer';

import { MessageType } from '~/enums';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';
import { User } from './User';

export class Message extends BaseModel {
  @Type(() => User)
  author?: User;

  authorId: string;

  @Type(() => Channel)
  channel?: Channel;

  channelId: string;

  content: string;

  @Type(() => Date)
  deletedAt?: Date;

  @Type(() => Date)
  editedAt?: Date;

  type: MessageType;
}
