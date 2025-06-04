import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'channels' })
export class ChannelsGateway {
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
