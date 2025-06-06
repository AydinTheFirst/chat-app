import { Expose, Type } from 'class-transformer';

import { UserRole } from '~/enums';

import { BaseModel } from './BaseModel';
import { Channel } from './Channel';
import { Friendship } from './Friendship';
import { Message } from './Message';
import { Profile } from './Profile';

export class User extends BaseModel {
  @Expose()
  @Type(() => Channel)
  channels?: Channel[];

  email: string;

  @Expose()
  @Type(() => Friendship)
  friendRequestsReceived?: Friendship[];

  @Expose()
  @Type(() => Friendship)
  friendRequestsSent?: Friendship[];

  @Expose()
  @Type(() => Message)
  messages?: Message[];

  @Expose()
  @Type(() => Channel)
  ownedChannels?: Channel[];

  // Password genelde expose edilmez, gizli tutulur, ama istersen kaldırabiliriz
  password: string;

  @Expose()
  @Type(() => Profile)
  profile?: Profile;

  @Expose()
  roles: UserRole[];

  @Expose()
  username: string;
}
