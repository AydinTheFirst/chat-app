import { Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';
import { Message } from './Message';
import { User } from './User';

export class ChannelReadStatus extends BaseModel {
  @Type(() => Channel)
  channel: Channel;

  channelId: string;

  createdAt: Date;

  id: string;

  @Type(() => Message)
  lastReadMessage?: Message;

  lastReadMessageId?: string;

  updatedAt: Date;

  @Type(() => User)
  user: User;

  userId: string;
}
