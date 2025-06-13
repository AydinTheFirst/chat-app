import { Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';

export class InviteLink extends BaseModel {
  @Type(() => Channel)
  channel?: Channel;

  channelId: string;

  code: string;

  @Type(() => Date)
  expiresAt?: Date;

  maxUses?: number;

  uses: number;
}
