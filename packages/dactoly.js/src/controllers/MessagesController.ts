import { CreateMessageDto, PaginatedResponseDto, QueryMessagesDto, UpdateMessageDto } from '~/dtos';
import { Message } from '~/models';

import { BaseController } from './BaseController';

export class MessagesController extends BaseController {
  async create(data: CreateMessageDto): Promise<Message> {
    const response = await this.client.http.post<unknown>('/messages', data);
    return Message.fromJSON(response.data);
  }

  async delete(messageId: string): Promise<void> {
    await this.client.http.delete(`/messages/${messageId}`);
  }

  async fetch(query: QueryMessagesDto): Promise<PaginatedResponseDto<Message>> {
    const response = await this.client.http.get<PaginatedResponseDto<unknown>>('/messages', {
      params: query,
    });

    return {
      ...response.data,
      items: response.data.items.map((item) => Message.fromJSON(item)),
    };
  }

  async fetchById(messageId: string): Promise<Message> {
    const response = await this.client.http.get<unknown>(`/messages/${messageId}`);
    return Message.fromJSON(response.data);
  }

  async update(messageId: string, data: UpdateMessageDto): Promise<Message> {
    const response = await this.client.http.patch<unknown>(`/messages/${messageId}`, data);
    return Message.fromJSON(response.data);
  }
}
