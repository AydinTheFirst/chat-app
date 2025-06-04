import { Module } from '@nestjs/common';

import { ChannelsGateway } from '../channels';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, ChannelsGateway],
})
export class MessagesModule {}
