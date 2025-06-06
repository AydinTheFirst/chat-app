import { DictolyClient } from '~/dictoly';
import { CreateFriendshipDto } from '~/dtos';
import { Friendship } from '~/models';

import { BaseController } from './BaseController';

export class FriendshipController extends BaseController {
  constructor(private client: DictolyClient) {
    super();
  }

  create(data: CreateFriendshipDto): Promise<Friendship> {
    return this.transformSingle(this.client.http.post('/friendships', data), Friendship);
  }

  async delete(friendshipId: string): Promise<void> {
    await this.client.http.delete(`/friendships/${friendshipId}`);
  }

  getAll(): Promise<Friendship[]> {
    return this.transformArray(this.client.http.get('/friendships'), Friendship);
  }

  getById(friendshipId: string): Promise<Friendship> {
    return this.transformSingle(this.client.http.get(`/friendships/${friendshipId}`), Friendship);
  }

  getPending(): Promise<Friendship[]> {
    return this.transformArray(this.client.http.get('/friendships/pending'), Friendship);
  }

  update(friendshipId: string, data: CreateFriendshipDto): Promise<Friendship> {
    return this.transformSingle(
      this.client.http.patch(`/friendships/${friendshipId}`, data),
      Friendship,
    );
  }
}
