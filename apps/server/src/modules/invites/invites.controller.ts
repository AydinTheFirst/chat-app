import { Controller, Param, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { InvitesService } from './invites.service';

@Controller('invites')
@UseGuards(AuthGuard)
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post(':channelId')
  createInvite(@Param('channelId') channelId: string, @GetUser('id') userId: string) {
    return this.invitesService.create(channelId, userId);
  }

  @Post(':code/join')
  joinChannel(@Param('code') code: string, @GetUser('id') userId: string) {
    return this.invitesService.joinByCode(code, userId);
  }
}
