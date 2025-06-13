import { DactolyClient } from '~/dactoly';
import { UpdateReadStatusDto } from '~/dtos';
import { ReadStatus } from '~/models';

import { BaseController } from './BaseController';

export class ReadStatusController extends BaseController {
  constructor(private client: DactolyClient) {
    super();
  }

  getStatus(channelId: string) {
    return this.transformSingle(this.client.http.get(`/read-status/${channelId}`), ReadStatus);
  }

  async getUnreadCount(channelId: string) {
    const response = await this.client.http.get(`/read-status/${channelId}/unread-count`);
    return response.data as number;
  }

  updateStatus(data: UpdateReadStatusDto) {
    return this.transformSingle(this.client.http.post('/read-status', data), ReadStatus);
  }
}
