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

import { CreateMessageDto, QueryMessageDto, UpdateMessageDto } from './messages.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @GetUser('id') userId: string) {
    return this.messagesService.create(createMessageDto, userId);
  }

  @Get()
  findAll(@Query() query: QueryMessageDto, @GetUser('id') userId: string) {
    return this.messagesService.findAll(query, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.messagesService.findOne(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.messagesService.remove(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @GetUser('id') userId: string,
  ) {
    return this.messagesService.update(id, updateMessageDto, userId);
  }
}
