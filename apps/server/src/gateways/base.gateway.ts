import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { PrismaService } from '~/database';

@WebSocketGateway({ cors: true })
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  protected logger = new Logger(this.constructor.name);

  constructor(protected prisma: PrismaService) {}

  emitError(client: Socket, error: string) {
    client.emit('error', error);
    this.logger.error(`Error emitted to client ${client.id}: ${error}`);
  }

  async handleConnection(client: Socket) {
    const { token } = client.handshake.auth;

    if (!token) {
      this.emitError(client, 'Unauthorized: No token provided');
      return client.disconnect();
    }

    const tokenDoc = await this.prisma.token.findUnique({
      include: { user: { select: { id: true, profile: true, username: true } } },
      where: { expiresAt: { gt: new Date() }, token },
    });

    if (!tokenDoc) {
      this.emitError(client, 'Unauthorized: Invalid or expired token');
      return client.disconnect();
    }

    client.emit('authSuccess', tokenDoc.user);

    client.data.user = tokenDoc.user;
    this.logger.log(`Client connected: ${client.id} as user ${tokenDoc.user.username}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
