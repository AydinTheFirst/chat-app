import { Client } from '~/client';
import { User } from '~/models';

export class UserService {
  constructor(private client: Client) {}

  async create(data: Partial<User>): Promise<User> {
    const response = await this.client.api.post('/users', data);
    const userInstance = User.fromJSON(response.data);
    return userInstance;
  }

  async delete(userId: string): Promise<void> {
    await this.client.api.delete(`/users/${userId}`);
  }

  async fetch(): Promise<User[]> {
    const response = await this.client.api.get<[]>('/users');
    const users = response.data.map((userData) => User.fromJSON(userData));
    return users;
  }

  async fetchById(userId: string): Promise<User> {
    const response = await this.client.api.get(`/users/${userId}`);
    const userInstance = User.fromJSON(response.data);
    return userInstance;
  }

  async update(userId: string, data: Partial<User>): Promise<User> {
    const response = await this.client.api.patch(`/users/${userId}`, data);
    const userInstance = User.fromJSON(response.data);
    return userInstance;
  }
}
