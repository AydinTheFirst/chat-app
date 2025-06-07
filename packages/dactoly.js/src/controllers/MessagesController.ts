import { DactolyClient } from '~/dactoly';
import { CreateMessageDto, UpdateMessageDto } from '~/dtos';
import { Message } from '~/models';

import { BaseController } from './BaseController';

export class MessagesController extends BaseController {
  constructor(private client: DactolyClient) {
    super();
  }

  create(data: CreateMessageDto): Promise<Message> {
    return this.transformSingle(this.client.http.post('/messages', data), Message);
  }

  async delete(messageId: string): Promise<void> {
    await this.client.http.delete(`/messages/${messageId}`);
  }

  getAll(): Promise<Message[]> {
    return this.transformArray(this.client.http.get('/messages'), Message);
  }

  getById(messageId: string): Promise<Message> {
    return this.transformSingle(this.client.http.get(`/messages/${messageId}`), Message);
  }

  update(messageId: string, data: UpdateMessageDto): Promise<Message> {
    return this.transformSingle(this.client.http.patch(`/messages/${messageId}`, data), Message);
  }
}
