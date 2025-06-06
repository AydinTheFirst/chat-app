import { DictolyClient } from '~/dictoly';
import { CreateChannelDto, UpdateChannelDto } from '~/dtos';
import { Channel, Message } from '~/models';

import { BaseController } from './BaseController';

export class ChannelsController extends BaseController {
  constructor(private client: DictolyClient) {
    super();
  }

  create(data: CreateChannelDto): Promise<Channel> {
    return this.transformSingle(this.client.http.post('/channels', data), Channel);
  }

  async delete(id: string) {
    await this.client.http.delete(`/channels/${id}`);
  }

  getAll() {
    return this.transformArray(this.client.http.get('/channels'), Channel);
  }

  getById(id: string) {
    return this.transformSingle(this.client.http.get(`/channels/${id}`), Channel);
  }

  getMessages(id: string) {
    return this.transformArray(this.client.http.get(`/channels/${id}/messages`), Message);
  }

  update(id: string, data: UpdateChannelDto) {
    return this.transformSingle(this.client.http.patch(`/channels/${id}`, data), Channel);
  }
}
