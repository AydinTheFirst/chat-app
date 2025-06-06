import { Logger } from '@nestjs/common';
import {
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

  private userSockets = new Map<string, Set<string>>();
  private userStatuses = new Map<string, UserStatus['status']>();

  handleDisconnect(client: Socket) {
    const user = client.data.user as User;
    if (!user) return;

    this.userStatuses.delete(user.id);
    this.broadcastStatus(user.id, 'offline');
    this.unsubscribeFromUserStatus(user.id, client.id);

    this.logger.log(`Client disconnected: ${client.id} as user ${user.username}`);
  }

  @SubscribeMessage('getStatus')
  handleGetStatus(client: Socket, userId: string) {
    const user = client.data.user as User;
    if (!user) {
      this.logger.warn(`Received status request from unauthenticated client: ${client.id}`);
      return;
    }

    const status = this.userStatuses.get(userId) || 'offline';
    this.subscribeToUserStatus(userId, client.id);

    client.emit('userStatus', { status, userId });
  }

  @SubscribeMessage('updateStatus')
  handleUpdateStatus(client: Socket, payload: { status: UserStatus['status'] }) {
    const user = client.data.user as User;
    if (!user) {
      this.logger.warn(`Received status update from unauthenticated client: ${client.id}`);
      return;
    }

    this.logger.log(
      `Received status update from user ${user.username} (${user.id}): ${payload.status}`,
    );

    this.userStatuses.set(user.id, payload.status);
    this.broadcastStatus(user.id, payload.status);
  }

  subscribeToUserStatus(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socketId);

    this.logger.log(`Subscribed socket ${socketId} to user ${userId}`);
  }

  unsubscribeFromUserStatus(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    this.logger.log(`Unsubscribed socket ${socketId} from user ${userId}`);
  }

  private broadcastStatus(userId: string, status: UserStatus['status']) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;

    this.logger.log(`Broadcasting status ${status} for user ${userId} to ${sockets.size} sockets`);

    for (const socketId of sockets) {
      this.server.to(socketId).emit('userStatus', { status, userId });
    }
  }
}
