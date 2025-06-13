import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '~/common/guards';

import { UpdateReadStatusDto } from './channel-read-status.dto';
import { ChannelReadStatusService } from './channel-read-status.service';

@Controller('read-status')
@UseGuards(AuthGuard)
export class ChannelReadStatusController {
  constructor(private readonly readStatusService: ChannelReadStatusService) {}

  @Get(':channelId')
  async getStatus(@Param('channelId') channelId: string, @Req() req) {
    const userId = req.user.id;
    return this.readStatusService.getStatus(userId, channelId);
  }

  @Post()
  async updateStatus(@Body() dto: UpdateReadStatusDto, @Req() req) {
    const userId = req.user.id;
    return this.readStatusService.updateStatus(userId, dto.channelId, dto.lastReadMessageId);
  }
}
