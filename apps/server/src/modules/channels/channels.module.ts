import { Global, Module } from '@nestjs/common';

import { ApplicationsService } from '../applications/applications.service';
import { FriendsService } from '../friendships/friends.service';
import { MessagesService } from '../messages/messages.service';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Global()
@Module({
  controllers: [ChannelsController],
  exports: [ChannelsService, FriendsService, MessagesService],
  providers: [ChannelsService, FriendsService, MessagesService, ApplicationsService],
})
export class ChannelsModule {}
