import { io, Socket } from 'socket.io-client';

import { DictolyEvents } from '~/events';

export function createWebsocket(token: string, baseURL?: string): Socket<DictolyEvents> {
  console.log('token', token);

  const socket = io(baseURL ?? 'https://api.dictoly.com', {
    auth: { token },
  });

  socket.on('connected', () => {
    console.log('connected');
  });

  socket.on('authSuccess', () => {
    console.log('Authentication successful');
    socket.emit('updateStatus', { status: 'online' });
  });

  socket.onAny(() => {
    console.log('event recieved');
  });

  return socket;
}
