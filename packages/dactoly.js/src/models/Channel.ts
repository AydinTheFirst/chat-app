import { Type } from 'class-transformer';

import { ChannelType } from '~/enums';

import { BaseModel } from './BaseModel';
import { ChannelReadStatus } from './ChannelReadStatus';
import { InviteLink } from './InviteLink';
import { Message } from './Message';
import { User } from './User';

export class Channel extends BaseModel {
  @Type(() => ChannelReadStatus)
  channelReadStatus: ChannelReadStatus[];

  @Type(() => Date)
  createdAt: Date;

  description?: string;

  id: string;

  @Type(() => InviteLink)
  inviteLinks: InviteLink[];

  isPublic: boolean;

  @Type(() => Message)
  lastMessage?: Message;

  lastMessageId?: string;

  @Type(() => Message)
  messages: Message[];

  name: string;

  @Type(() => User)
  owner?: User;

  ownerId?: string;

  type: ChannelType;

  @Type(() => Date)
  updatedAt: Date;

  @Type(() => User)
  users: User[];

  async delete(): Promise<void> {
    await this.client.channels.delete(this.id);
  }

  async send(content: string): Promise<Message> {
    return await this.client.messages.create({
      channelId: this.id,
      content,
    });
  }

  startTyping(): void {
    this.client.ws.emit('startTyping', this.id);
  }

  stopTyping(): void {
    this.client.ws.emit('stopTyping', this.id);
  }
}
