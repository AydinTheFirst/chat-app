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

  updateStatus(data: UpdateReadStatusDto) {
    return this.transformSingle(this.client.http.post('/read-status', data), ReadStatus);
  }
}
