import { io } from 'socket.io-client';

import { DactolySocket } from '~/events';
import { DactolyClientConfig } from '~/types';

export function createWebsocket({ baseUrl, token }: DactolyClientConfig): DactolySocket {
  const socket = io(baseUrl ?? 'https://api.dactoly.com', {
    auth: { token },
    autoConnect: false,
  });

  return socket;
}
