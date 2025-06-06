import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  readonly logger = new Logger(MessagesGateway.name);

  @WebSocketServer()
  server: Server;

  emitMessageCreate(message: Message) {
    this.server.to(message.channelId).emit('messageCreate', message);
  }

  emitMessageDelete(message: Message) {
    this.server.to(message.channelId).emit('messageDelete', message);
  }

  emitMessageUpdate(message: Message) {
    this.server.to(message.channelId).emit('messageUpdate', message);
  }
}
