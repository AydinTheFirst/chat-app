import { Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { User } from './User';

export class Friendship extends BaseModel {
  @Type(() => Date)
  createdAt: Date;

  @Type(() => User)
  from: User;

  fromId: string;
  id: string;

  status: string;

  @Type(() => User)
  to: User;

  toId: string;

  @Type(() => Date)
  updatedAt: Date;

  async accept(): Promise<Friendship> {
    return await this.client.friendships.update(this.id, { status: 'ACCEPTED' });
  }

  async reject(): Promise<Friendship> {
    return await this.client.friendships.update(this.id, { status: 'REJECTED' });
  }
}
