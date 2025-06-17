import { Collection } from '@discordjs/collection';

import { Client } from '~/client';
import { MessageQueryDto } from '~/dtos';
import { Message } from '~/models';
import { Paginator } from '~/utils/Paginator';

export class MessageService {
  cache = new Collection<string, Message>();

  constructor(private client: Client) {
    client.ws.on('messageCreate', (message: Message) => {
      const messageInstance = Message.fromJSON(message);
      this.cache.set(messageInstance.id, messageInstance);
    });

    client.ws.on('messageUpdate', (message: Message) => {
      const messageInstance = Message.fromJSON(message);
      this.cache.set(messageInstance.id, messageInstance);
    });

    client.ws.on('messageDelete', (message: Message) => {
      this.cache.delete(message.id);
    });
  }

  async create(data: Partial<Message>): Promise<Message> {
    const response = await this.client.api.post('/messages', data);
    const messageInstance = Message.fromJSON(response.data);
    return messageInstance;
  }

  async delete(messageId: string): Promise<void> {
    await this.client.api.delete(`/messages/${messageId}`);
  }

  async fetch(query: MessageQueryDto): Promise<Paginator<Message>> {
    const response = await this.client.api.get('/messages', {
      params: query,
    });

    return new Paginator<Message>(this.client, Message, '/messages', response.data, query.limit);
  }

  async fetchById(messageId: string): Promise<Message> {
    const response = await this.client.api.get(`/messages/${messageId}`);
    const messageInstance = Message.fromJSON(response.data);
    return messageInstance;
  }

  async update(messageId: string, data: Partial<Message>): Promise<Message> {
    const response = await this.client.api.patch(`/messages/${messageId}`, data);
    const messageInstance = Message.fromJSON(response.data);
    return messageInstance;
  }
}
