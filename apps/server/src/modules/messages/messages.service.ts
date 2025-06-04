import { Injectable, NotFoundException } from '@nestjs/common';

import { QueryService } from '~/common/services/query.service';
import { Message, Prisma, PrismaService } from '~/database';

import { ChannelsGateway } from '../channels';
import { CreateMessageDto, QueryMessageDto, UpdateMessageDto } from './messages.dto';

@Injectable()
export class MessagesService extends QueryService<Message> {
  constructor(
    private prisma: PrismaService,
    private channelsGateway: ChannelsGateway,
  ) {
    super(prisma.message);
  }

  async create(createMessageDto: CreateMessageDto, userId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: createMessageDto.channelId,
        users: { some: { id: userId } },
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found or you are not a member of this channel');
    }

    const message = await this.prisma.message.create({
      data: {
        author: {
          connect: { id: userId },
        },
        channel: {
          connect: { id: createMessageDto.channelId },
        },
        content: createMessageDto.content,
      },
    });

    this.channelsGateway.emitMessageCreate(message);

    return message;
  }

  findAll(query: QueryMessageDto, userId: string) {
    const where: Prisma.MessageWhereInput = {
      authorId: userId,
    };

    const messages = this.queryAll(query, ['content'], where);

    if (!messages) {
      throw new NotFoundException('No messages found for this user');
    }

    return messages;
  }

  async findOne(id: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { authorId: userId, id },
    });

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    return message;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    const message = await this.prisma.message.delete({
      where: { id },
    });

    this.channelsGateway.emitMessageDelete(message);

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, userId: string) {
    await this.findOne(id, userId);

    const updatedMessage = await this.prisma.message.update({
      data: {
        editedAt: new Date(),
        ...updateMessageDto,
      },
      where: { id },
    });

    if (!updatedMessage) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    this.channelsGateway.emitMessageUpdate(updatedMessage);

    return updatedMessage;
  }
}
