import { UpdateReadStatusDto } from '~/dtos';
import { ReadStatus } from '~/models';

import { BaseController } from './BaseController';

export class ReadStatusController extends BaseController {
  async getStatus(channelId: string) {
    const response = await this.client.http.get(`/read-status/${channelId}`);
    return ReadStatus.fromJSON(response.data);
  }

  async getUnreadCount(channelId: string) {
    const response = await this.client.http.get(`/read-status/${channelId}/unread-count`);
    return isNaN(response.data.count) ? 0 : response.data.count;
  }

  async updateStatus(data: UpdateReadStatusDto) {
    const response = await this.client.http.post('/read-status', data);
    return ReadStatus.fromJSON(response.data);
  }
}
