import { Type } from 'class-transformer';

import { Application } from './Application';
import { BaseModel } from './BaseModel';
import { Channel } from './Channel';
import { Message } from './Message';
import { Profile } from './Profile';
import { Token } from './Token';

export class User extends BaseModel {
  @Type(() => Application)
  application?: Application;

  @Type(() => Channel)
  channels: Channel[];

  createdAt: Date;

  email?: string;

  @Type(() => User)
  friendRequestsReceived: User[];

  @Type(() => User)
  friendRequestsSent: User[];

  id: string;

  isBot: boolean;

  @Type(() => Message)
  messages: Message[];

  @Type(() => Application)
  ownedApplications: Application[];

  @Type(() => Channel)
  ownedChannels: Channel[];

  password?: string;

  @Type(() => Profile)
  profile?: Profile;

  roles: string[];

  @Type(() => Token)
  tokens: Token[];

  updatedAt: Date;

  username: string;

  async delete(): Promise<void> {
    await this.client.users.delete(this.id);
  }
}
