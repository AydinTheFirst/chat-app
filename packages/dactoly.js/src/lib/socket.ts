import { io } from 'socket.io-client';

import { DactolySocket } from '~/events';
import { DactolyClientConfig } from '~/types';

export function createWebsocket({ baseUrl, token }: DactolyClientConfig): DactolySocket {
  const socket: DactolySocket = io(baseUrl ?? 'https://api.dactoly.com', {
    auth: { token },
    autoConnect: false,
  });

  socket.on('channelCraete', (channel) => {
    socket.emit('join', channel.id);
  });

  socket.on('channelDelete', (channel) => {
    socket.emit('leave', channel.id);
  });

  return socket;
}
