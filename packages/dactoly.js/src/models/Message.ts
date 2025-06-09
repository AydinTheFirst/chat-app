import { Expose, Type } from 'class-transformer';

import { MessageType } from '~/enums';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';
import { User } from './User';

export class Message extends BaseModel {
  @Expose()
  @Type(() => User)
  author?: User;

  @Expose()
  authorId: string;

  @Expose()
  @Type(() => Channel)
  channel?: Channel;

  @Expose()
  channelId: string;

  @Expose()
  content: string;

  @Type(() => Date)
  deletedAt?: Date;

  @Expose()
  @Type(() => Date)
  editedAt?: Date;

  @Expose()
  type: MessageType;
}
