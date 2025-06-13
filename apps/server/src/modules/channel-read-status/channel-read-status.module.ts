import { Module } from '@nestjs/common';

import { ChannelReadStatusController } from './channel-read-status.controller';
import { ChannelReadStatusService } from './channel-read-status.service';

@Module({
  controllers: [ChannelReadStatusController],
  providers: [ChannelReadStatusService],
})
export class ChannelReadStatusModule {}
