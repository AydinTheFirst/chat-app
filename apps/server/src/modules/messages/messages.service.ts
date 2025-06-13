import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { QueryService } from '~/common/services/query.service';
import { Message, Prisma, PrismaService } from '~/database';
import { MessagesGateway } from '~/gateways/messages.gateway';

import { CreateMessageDto, QueryMessageDto, UpdateMessageDto } from './messages.dto';

@Injectable()
export class MessagesService extends QueryService<Message> {
  messageInclude: Prisma.MessageInclude = {
    author: { select: { id: true, profile: true, username: true } },
    channel: { include: { lastMessage: true } },
  };

  constructor(
    private prisma: PrismaService,
    private messagesGateway: MessagesGateway,
  ) {
    super(prisma.message);
  }

  async create(createMessageDto: CreateMessageDto, userId: string) {
    const channel = await this.prisma.channel.findFirst({
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
      include: this.messageInclude,
    });

    this.messagesGateway.emitMessageCreate(message);

    await this.prisma.channel.update({
      data: {
        lastMessage: { connect: { id: message.id } },
      },
      where: {
        id: message.channelId,
      },
    });

    return message;
  }

  findAll(query: QueryMessageDto) {
    const { channelId, ...rest } = query;

    const where: Prisma.MessageWhereInput = {};

    if (channelId) {
      where.channelId = channelId;
    }

    const messages = this.queryAll(
      {
        ...rest,
        include: this.messageInclude,
      },
      ['content'],
      where,
    );

    return messages;
  }

  async findOne(id: string, userId: string) {
    const message = await this.prisma.message.findFirst({
      where: { authorId: userId, id },
    });

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    return message;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    const message = await this.prisma.message.update({
      data: {
        content: 'null',
        deletedAt: new Date(),
      },
      include: this.messageInclude,
      where: { id },
    });

    this.messagesGateway.emitMessageDelete(message);

    return message;
  }

  async sendSystemMessage(channelId: string, content: string) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new BadRequestException();
    }

    const message = await this.prisma.message.create({
      data: {
        channel: { connect: { id: channelId } },
        content,
        type: 'SYSTEM',
      },
    });

    this.messagesGateway.emitMessageCreate(message);

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, userId: string) {
    await this.findOne(id, userId);

    const updatedMessage = await this.prisma.message.update({
      data: {
        editedAt: new Date(),
        ...updateMessageDto,
      },
      include: this.messageInclude,
      where: { id },
    });

    if (!updatedMessage) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    this.messagesGateway.emitMessageUpdate(updatedMessage);

    return updatedMessage;
  }
}
