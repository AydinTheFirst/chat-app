import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { UpdateReadStatusDto } from './channel-read-status.dto';
import { ChannelReadStatusService } from './channel-read-status.service';

@Controller('read-status')
@UseGuards(AuthGuard)
export class ChannelReadStatusController {
  constructor(private readonly readStatusService: ChannelReadStatusService) {}

  @Get(':channelId')
  getStatus(@Param('channelId') channelId: string, @GetUser('id') userId: string) {
    return this.readStatusService.getStatus(userId, channelId);
  }

  @Get(':channelId/unread-count')
  getUnreadCount(@Param('channelId') channelId: string, @GetUser('id') userId: string) {
    return this.readStatusService.getUnreadCount(userId, channelId);
  }

  @Post()
  updateStatus(@Body() dto: UpdateReadStatusDto, @GetUser('id') userId: string) {
    return this.readStatusService.updateStatus(userId, dto.channelId, dto.lastReadMessageId);
  }
}
