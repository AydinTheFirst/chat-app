import { CreateChannelDto, UpdateChannelDto } from '~/dtos';
import { Channel } from '~/models';

import { BaseController } from './BaseController';

export class ChannelsController extends BaseController {
  async create(data: CreateChannelDto): Promise<Channel> {
    const response = await this.client.http.post<unknown>('/channels', data);
    return Channel.fromJSON(response.data);
  }

  async delete(id: string) {
    await this.client.http.delete<unknown>(`/channels/${id}`);
  }

  async fetch(): Promise<Channel[]> {
    const response = await this.client.http.get<unknown[]>('/channels');
    return response.data.map((item) => Channel.fromJSON(item));
  }

  async fetchById(id: string) {
    const response = await this.client.http.get<unknown>(`/channels/${id}`);
    return Channel.fromJSON(response.data);
  }

  async update(id: string, data: UpdateChannelDto) {
    const response = await this.client.http.patch<unknown>(`/channels/${id}`, data);
    return Channel.fromJSON(response.data);
  }
}
