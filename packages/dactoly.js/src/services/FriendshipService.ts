import { Client } from '~/client';
import { Friendship } from '~/models';

export class FriendshipService {
  constructor(private client: Client) {}

  async create(data: Partial<Friendship>): Promise<Friendship> {
    const response = await this.client.api.post('/friendships', data);
    const friendshipInstance = Friendship.fromJSON(response.data);
    return friendshipInstance;
  }

  async delete(friendshipId: string): Promise<void> {
    await this.client.api.delete(`/friendships/${friendshipId}`);
  }

  async fetch(): Promise<Friendship[]> {
    const response = await this.client.api.get<[]>('/friendships');
    const friendships = response.data.map((friendshipData) => Friendship.fromJSON(friendshipData));
    return friendships;
  }

  async fetchById(friendshipId: string): Promise<Friendship> {
    const response = await this.client.api.get(`/friendships/${friendshipId}`);
    const friendshipInstance = Friendship.fromJSON(response.data);
    return friendshipInstance;
  }

  async fetchPending(): Promise<Friendship[]> {
    const response = await this.client.api.get<[]>('/friendships/pending');
    const friendships = response.data.map((friendshipData) => Friendship.fromJSON(friendshipData));
    return friendships;
  }

  async update(friendshipId: string, data: Partial<Friendship>): Promise<Friendship> {
    const response = await this.client.api.patch(`/friendships/${friendshipId}`, data);
    const friendshipInstance = Friendship.fromJSON(response.data);
    return friendshipInstance;
  }
}
