import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Channel, User } from '@prisma/client';
import { Server, Socket } from 'socket.io';

interface ChannelWithUsers extends Channel {
  users: User[];
}

@WebSocketGateway({ cors: true })
export class ChannelsGateway {
  readonly logger = new Logger(ChannelsGateway.name);

  @WebSocketServer()
  server: Server;

  broadcastChannelEvent(event: string, channel: ChannelWithUsers) {
    const sockets = this.server.sockets.sockets;

    const userIds = new Set(channel.users.map((u) => u.id));

    for (const socket of sockets.values()) {
      const user = socket.data.user as User;
      if (!user) continue;
      if (userIds.has(user.id)) {
        socket.emit(event, channel);
        this.logger.log(
          `Emitted ${event} to user ${user.username} (${user.id}) in channel ${channel.id}`,
        );
      }
    }
  }

  emitChannelCreate(channel: ChannelWithUsers) {
    return this.broadcastChannelEvent('channelCreate', channel);
  }

  emitChannelDelete(channel: ChannelWithUsers) {
    return this.broadcastChannelEvent('channelDelete', channel);
  }

  emitChannelJoin(channel: ChannelWithUsers) {
    return this.broadcastChannelEvent('channelJoin', channel);
  }

  emitChannelLeave(channel: ChannelWithUsers) {
    return this.broadcastChannelEvent('channelLeave', channel);
  }

  emitChannelUpdate(channel: ChannelWithUsers) {
    return this.broadcastChannelEvent('channelUpdate', channel);
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

  @SubscribeMessage('startTyping')
  handleStartTyping(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    const user = client.data.user as User;
    if (!user) return;

    this.logger.log(`User ${user.username} (${user.id}) started typing in channel ${channelId}`);

    this.server.to(channelId).emit('startTyping', { channelId: channelId, user });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    const user = client.data.user as User;
    if (!user) return;

    this.logger.log(`User ${user.username} (${user.id}) stopped typing in channel ${channelId}`);

    this.server.to(channelId).emit('stopTyping', { channelId: channelId, user });
  }
}
