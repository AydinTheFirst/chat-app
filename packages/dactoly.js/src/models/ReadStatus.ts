import { BaseModel } from './BaseModel';
import { Channel } from './Channel';
import { Message } from './Message';
import { User } from './User';

export class ReadStatus extends BaseModel {
  channel?: Channel;

  channelId: string;

  lastReadMessage?: Message;

  lastReadMessageId?: string;

  user?: User;

  userId: string;
}

/**
 *   userId            String
  channelId         String
  lastReadMessageId String?

  user            User     @relation(fields: [userId], references: [id])
  channel         Channel  @relation(fields: [channelId], references: [id])
  lastReadMessage Message? @relation(fields: [lastReadMessageId], references: [id])
 */
