import { Type } from 'class-transformer';

import { MessageType } from '~/enums';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';
import { User } from './User';

export class Message extends BaseModel {
  @Type(() => User)
  author?: User;

  authorId?: string;

  @Type(() => Channel)
  channel: Channel;

  channelId: string;

  @Type(() => Channel)
  channelLastMessage?: Channel;

  content: string;

  createdAt: Date;

  deletedAt?: Date;

  editedAt?: Date;

  id: string;

  type: MessageType;

  updatedAt: Date;

  async delete(): Promise<void> {
    await this.client.messages.delete(this.id);
  }

  async edit(content: string): Promise<Message> {
    const updated = await this.client.messages.update(this.id, { content });
    return updated;
  }
}
