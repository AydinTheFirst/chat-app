import { Global, Module } from '@nestjs/common';

import { BaseGateway } from './base.gateway';
import { ChannelsGateway } from './channels.gateway';
import { MessagesGateway } from './messages.gateway';
import { StatusGateway } from './status.gateway';

@Global()
@Module({
  exports: [ChannelsGateway, MessagesGateway, StatusGateway, BaseGateway],
  providers: [ChannelsGateway, MessagesGateway, StatusGateway, BaseGateway],
})
export class GatewaysModule {}
