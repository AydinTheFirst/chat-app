import { io } from 'socket.io-client';

import { DactolyClient } from '~/dactoly';
import { DactolySocket } from '~/events';
import { Message } from '~/models';
import { DactolyClientConfig } from '~/types';

export function createWebsocket(
  client: DactolyClient,
  { baseUrl, token }: DactolyClientConfig,
): DactolySocket {
  const socket: DactolySocket = io(baseUrl ?? 'https://api.dactoly.com', {
    auth: { token },
    autoConnect: false,
  });

  socket.on('messageCreate', (msg) => {
    client.emit('messageCreate', Message.fromJSON(msg));
  });

  socket.on('channelCraete', (channel) => {
    socket.emit('join', channel.id);
  });

  socket.on('channelDelete', (channel) => {
    socket.emit('leave', channel.id);
  });

  return socket;
}
