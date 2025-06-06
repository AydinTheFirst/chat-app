import { Message, User } from './models';
import { UserStatus } from './types';

export interface DictolyEvents {
  joined: [string];
  left: [string];
  messageCreate: [Message];
  messageDelete: [Message];
  messageUpdate: [Message];
  ready: [User];
  startTyping: [{ channelId: string; user: User }];
  stopTyping: [{ channelId: string; user: User }];
  userStatus: [{ status: UserStatus; userId: string }];
}
