import { Client } from '~/client';
import { ChannelReadStatus } from '~/models';

export class ChannelReadStatusService {
  constructor(private client: Client) {}

  async getStatus(channelId: string) {
    const response = await this.client.api.get(`/read-status/${channelId}`);
    return ChannelReadStatus.fromJSON(response.data);
  }

  async getUnreadCount(channelId: string) {
    const response = await this.client.api.get(`/read-status/${channelId}/unread-count`);
    return isNaN(response.data.count) ? 0 : response.data.count;
  }

  async updateStatus(data: Partial<ChannelReadStatus>) {
    const response = await this.client.api.post('/read-status', data);
    return ChannelReadStatus.fromJSON(response.data);
  }
}
