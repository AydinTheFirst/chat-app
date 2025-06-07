import { Socket } from 'socket.io-client';

import { Message, User } from './models';
import { UserStatus } from './types';

export interface ClientToServerEvents {
  join: (channelId: string) => void;
  leave: (channelId: string) => void;
  startTyping: (channelId: string) => void;
  stopTyping: (channelId: string) => void;
  subscribeStatus: (userId: string) => void;
  unsubscribeStatus: (userId: string) => void;
  updateStatus: (status: UserStatus) => void;
}

export type DactolySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface ServerToClientEvents {
  authSuccess: (user: User) => void;
  joined: (userId: string) => void;
  left: (userId: string) => void;
  messageCreate: (message: Message) => void;
  messageDelete: (message: Message) => void;
  messageUpdate: (message: Message) => void;
  startTyping: (data: { channelId: string; user: User }) => void;
  stopTyping: (data: { channelId: string; user: User }) => void;
  userStatus: (data: { status: UserStatus; userId: string }) => void;
}
