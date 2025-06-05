import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChannelsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ChannelsGateway.name);

  emitMessageCreate(message: Message) {
    this.server.to(message.channelId).emit('messageCreate', message);
  }

  emitMessageDelete(message: Message) {
    this.server.to(message.channelId).emit('messageDelete', message);
  }

  emitMessageUpdate(message: Message) {
    this.server.to(message.channelId).emit('messageUpdate', message);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    client.join(channelId);
    client.emit('joined', channelId);
  }

  @SubscribeMessage('leave')
  handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    client.leave(channelId);
    client.emit('left', channelId);
  }
}
