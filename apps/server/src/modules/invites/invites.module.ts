import { Module } from '@nestjs/common';

import { ChannelsService } from '../channels';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';

@Module({
  controllers: [InvitesController],
  providers: [InvitesService, ChannelsService],
})
export class InvitesModule {}
