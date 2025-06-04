import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { QueryService } from '~/common/services/query.service';
import { Channel, Prisma, PrismaService } from '~/database';

import { CreateChannelDto, QueryChannelDto, UpdateChannelDto } from './channels.dto';

@Injectable()
export class ChannelsService extends QueryService<Channel> {
  constructor(private prisma: PrismaService) {
    super(prisma.channel);
  }

  async create(createChannelDto: CreateChannelDto, userId: string) {
    const channel = await this.prisma.channel.create({
      data: {
        ...createChannelDto,
        owner: {
          connect: { id: userId },
        },
        users: {
          connect: { id: userId },
        },
      },
    });

    return channel;
  }

  async findAll(query: QueryChannelDto, userId: string) {
    const where: Prisma.ChannelWhereInput = {
      users: {
        some: { id: userId },
      },
    };

    const channels = await this.queryAll(query, ['name', 'description'], where);

    return channels;
  }

  async findMessages(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      include: {
        messages: true,
      },
      where: {
        id,
        users: { some: { id: userId } },
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found or you are not a member of this channel');
    }

    return channel.messages;
  }

  async findOne(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        id,
        users: { some: { id: userId } },
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found or you are not a member of this channel');
    }

    return channel;
  }

  async remove(id: string, userId: string) {
    const channel = await this.findOne(id, userId);

    if (channel.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this channel');
    }

    const deletedChannel = await this.prisma.channel.delete({
      where: { id },
    });

    return deletedChannel;
  }

  async update(id: string, updateChannelDto: UpdateChannelDto, userId: string) {
    const channel = await this.findOne(id, userId);

    if (channel.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this channel');
    }

    const updatedChannel = await this.prisma.channel.update({
      data: updateChannelDto,
      where: { id },
    });

    return updatedChannel;
  }
}
