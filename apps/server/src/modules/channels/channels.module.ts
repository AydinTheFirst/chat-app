import { Global, Module } from '@nestjs/common';

import { FriendsService } from '../friendships/friends.service';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Global()
@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, FriendsService],
})
export class ChannelsModule {}
