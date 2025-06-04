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

import { CreateChannelDto, QueryChannelDto, UpdateChannelDto } from './channels.dto';
import { ChannelsService } from './channels.service';

@Controller('channels')
@UseGuards(AuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @GetUser('id') userId: string) {
    return this.channelsService.create(createChannelDto, userId);
  }

  @Get()
  findAll(@Query() query: QueryChannelDto, @GetUser('id') userId: string) {
    return this.channelsService.findAll(query, userId);
  }

  @Get(':id/messages')
  findMessages(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.channelsService.findMessages(id, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.channelsService.findOne(id, userId);
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
