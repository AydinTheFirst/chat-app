import { Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';

export class InviteLink extends BaseModel {
  @Type(() => Channel)
  channel: Channel;

  channelId: string;

  code: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  expiresAt?: Date;

  id: string;

  maxUses?: number;

  updatedAt: Date;

  uses: number;
}
