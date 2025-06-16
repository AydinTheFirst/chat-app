import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { ApplicationsService } from '../applications/applications.service';
import { CreateChannelDto, QueryChannelDto, UpdateChannelDto } from './channels.dto';
import { ChannelsService } from './channels.service';

@Controller('channels')
@UseGuards(AuthGuard)
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @GetUser('id') userId: string) {
    return this.channelsService.create(createChannelDto, userId);
  }

  @Post('dm/:targetUserId')
  createDMChannel(@Param('targetUserId') targetUserId: string, @GetUser('id') userId: string) {
    return this.channelsService.createDMChannel(userId, targetUserId);
  }

  @Get()
  findAll(@Query() query: QueryChannelDto, @GetUser('id') userId: string) {
    return this.channelsService.findAll(query, userId);
  }

  @Get('dm')
  findAllDMChannels(@GetUser('id') userId: string) {
    return this.channelsService.findAllDMChannels(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.channelsService.findOne(id, userId);
  }

  @Post(':channelId/applications/:applicationId/join')
  async joinApplicationToChannel(
    @GetUser('id') userId: string,
    @Param('channelId') channelId: string,
    @Param('applicationId') applicationId: string,
  ) {
    const application = await this.applicationsService.findOne(userId, applicationId);
    return this.channelsService.addApplicationToChannel(channelId, application.bot.id);
  }

  @Delete(':id/kick/:userId')
  kickUser(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.channelsService.kickUserFromChannel(id, userId, targetUserId);
  }

  @Delete(':id/leave')
  leaveChannel(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.channelsService.leaveChannel(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.channelsService.remove(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
    @GetUser('id') userId: string,
  ) {
    return this.channelsService.update(id, updateChannelDto, userId);
  }
}
