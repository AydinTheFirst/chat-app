import { Expose, Type } from 'class-transformer';

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

  @Expose()
  @Type(() => Date)
  editedAt?: Date;
}
