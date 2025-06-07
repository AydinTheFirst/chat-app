import { Expose, Type } from 'class-transformer';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';

export class InviteLink extends BaseModel {
  @Expose()
  @Type(() => Channel)
  channel?: Channel;

  @Expose()
  channelId: string;

  @Expose()
  code: string;

  @Expose()
  @Type(() => Date)
  expiresAt?: Date;

  @Expose()
  maxUses?: number;

  @Expose()
  uses: number;
}
