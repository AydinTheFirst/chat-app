import { CreateFriendshipDto } from '~/dtos';
import { Friendship } from '~/models';

import { BaseController } from './BaseController';

export class FriendshipController extends BaseController {
  async create(data: CreateFriendshipDto): Promise<Friendship> {
    const response = await this.client.http.post<unknown>('/friendships', data);
    return Friendship.fromJSON(response.data);
  }

  async delete(friendshipId: string): Promise<void> {
    await this.client.http.delete(`/friendships/${friendshipId}`);
  }

  async fetch(): Promise<Friendship[]> {
    const response = await this.client.http.get<unknown[]>('/friendships');
    return response.data.map((item) => Friendship.fromJSON(item));
  }

  async fetchById(friendshipId: string): Promise<Friendship> {
    const response = await this.client.http.get<unknown>(`/friendships/${friendshipId}`);
    return Friendship.fromJSON(response.data);
  }

  async fetchPending(): Promise<Friendship[]> {
    const response = await this.client.http.get<unknown[]>('/friendships/pending');
    return response.data.map((item) => Friendship.fromJSON(item));
  }

  async update(friendshipId: string, data: CreateFriendshipDto): Promise<Friendship> {
    const response = await this.client.http.patch<unknown>(`/friendships/${friendshipId}`, data);
    return Friendship.fromJSON(response.data);
  }
}
