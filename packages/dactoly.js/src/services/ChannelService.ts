import { Collection } from '@discordjs/collection';

import { Client } from '~/client';
import { Channel } from '~/models';

export class ChannelService {
  cache = new Collection<string, Channel>();

  constructor(private client: Client) {
    this.client.ws.on('channelCraete', (channel: Channel) => {
      const channelInstance = Channel.fromJSON(channel);
      this.cache.set(channelInstance.id, channelInstance);
    });

    this.client.ws.on('channelUpdate', (channel: Channel) => {
      const channelInstance = Channel.fromJSON(channel);
      this.cache.set(channelInstance.id, channelInstance);
    });

    this.client.ws.on('channelDelete', (channel: Channel) => {
      this.cache.delete(channel.id);
    });
  }

  async create(data: Partial<Channel>): Promise<Channel> {
    const response = await this.client.api.post('/channels', data);
    const channelInstance = Channel.fromJSON(response.data);
    return channelInstance;
  }

  async delete(channelId: string): Promise<void> {
    await this.client.api.delete(`/channels/${channelId}`);
  }

  async fetch(): Promise<Channel[]> {
    const response = await this.client.api.get<[]>('/channels');
    const channels = response.data.map((channelData) => Channel.fromJSON(channelData));
    return channels;
  }

  async fetchById(channelId: string): Promise<Channel> {
    const response = await this.client.api.get(`/channels/${channelId}`);
    const channelInstance = Channel.fromJSON(response.data);
    return channelInstance;
  }

  async update(channelId: string, data: Partial<Channel>): Promise<Channel> {
    const response = await this.client.api.patch(`/channels/${channelId}`, data);
    const channelInstance = Channel.fromJSON(response.data);
    return channelInstance;
  }
}
