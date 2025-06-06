import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChannelsGateway {
  readonly logger = new Logger(ChannelsGateway.name);

  @WebSocketServer()
  server: Server;

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

  @SubscribeMessage('startTyping')
  handleStartTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { channelId: string },
  ) {
    const user = client.data.user as User;
    if (!user) return;

    this.logger.log(
      `User ${user.username} (${user.id}) started typing in channel ${payload.channelId}`,
    );

    this.server.to(payload.channelId).emit('startTyping', { channelId: payload.channelId, user });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { channelId: string },
  ) {
    const user = client.data.user as User;
    if (!user) return;

    this.logger.log(
      `User ${user.username} (${user.id}) stopped typing in channel ${payload.channelId}`,
    );

    this.server.to(payload.channelId).emit('stopTyping', { channelId: payload.channelId, user });
  }
}
