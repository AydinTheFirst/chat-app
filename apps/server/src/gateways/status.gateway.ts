import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';

interface UserStatus {
  status: 'idle' | 'offline' | 'online';
  userId: string;
}

@WebSocketGateway({ cors: true })
export class StatusGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(StatusGateway.name);

  // socket.id -> Set<targetUserId>
  private subscriptions = new Map<string, Set<string>>();

  // userId -> status
  private userStatuses = new Map<string, UserStatus['status']>();

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const user = client.data.user as User;
    this.subscriptions.delete(client.id);

    if (user) {
      this.userStatuses.delete(user.id);
      this.broadcastStatus(user.id, 'offline');
      this.logger.log(`Client disconnected: ${client.id} as user ${user.username}`);
    } else {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('updateStatus')
  handleUpdateStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() status: UserStatus['status'],
  ) {
    const user = client.data.user as User;
    if (!user) {
      this.logger.warn(`Received status update from unauthenticated client: ${client.id}`);
      return;
    }

    this.logger.log(`Received status update from user ${user.username} (${user.id}): ${status}`);

    this.userStatuses.set(user.id, status);
    this.broadcastStatus(user.id, status);
  }

  @SubscribeMessage('subscribeStatus')
  subscribeToUserStatus(@ConnectedSocket() socket: Socket, @MessageBody() targetUserId: string) {
    if (!this.subscriptions.has(socket.id)) {
      this.subscriptions.set(socket.id, new Set());
    }

    this.subscriptions.get(socket.id).add(targetUserId);

    const status = this.userStatuses.get(targetUserId) || 'offline';
    socket.emit('userStatus', { status, userId: targetUserId });

    this.logger.log(`Socket ${socket.id} subscribed to user ${targetUserId}`);
  }

  @SubscribeMessage('unsubscribeStatus')
  unsubscribeFromUserStatus(
    @ConnectedSocket() socket: Socket,
    @MessageBody() targetUserId: string,
  ) {
    const targets = this.subscriptions.get(socket.id);

    if (targets) {
      targets.delete(targetUserId);
      if (targets.size === 0) {
        this.subscriptions.delete(socket.id);
      }
    }

    this.logger.log(`Socket ${socket.id} unsubscribed from user ${targetUserId}`);
  }

  private broadcastStatus(userId: string, status: UserStatus['status']) {
    for (const [socketId, targetIds] of this.subscriptions.entries()) {
      if (targetIds.has(userId)) {
        this.server.to(socketId).emit('userStatus', { status, userId });
      }
    }

    this.logger.log(`Broadcasted status ${status} for user ${userId}`);
  }
}
