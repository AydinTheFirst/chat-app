import { MessageType } from '~/enums';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';
import { User } from './User';

export class Message extends BaseModel {
  author?: User;

  authorId: string;

  channel?: Channel;

  channelId: string;

  content: string;

  deletedAt?: Date;

  editedAt?: Date;

  type: MessageType;

  get client() {
    return super.client;
  }

  reply(content: string) {
    return super.client.messages.create({
      channelId: this.channelId,
      content,
    });
  }
}
