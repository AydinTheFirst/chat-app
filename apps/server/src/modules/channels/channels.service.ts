import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

import { QueryService } from '~/common/services/query.service';
import { Channel, Prisma, PrismaService } from '~/database';

import { FriendsService } from '../friendships/friends.service';
import { CreateChannelDto, QueryChannelDto, UpdateChannelDto } from './channels.dto';

@Injectable()
export class ChannelsService extends QueryService<Channel> {
  userSelect: Prisma.UserSelect = {
    avatarUrl: true,
    displayName: true,
    id: true,
    username: true,
  };

  constructor(
    private prisma: PrismaService,
    private friendsService: FriendsService,
  ) {
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

  async createDMChannel(userId: string, targetUserId: string) {
    const isFriend = await this.friendsService.isFriend(userId, targetUserId);

    if (!isFriend) {
      throw new ForbiddenException('You can only create a DM channel with friends.');
    }

    const existingChannel = await this.prisma.channel.findFirst({
      where: {
        type: 'DM',
        users: {
          every: {
            id: { in: [userId, targetUserId] },
          },
        },
      },
    });

    if (existingChannel) {
      return existingChannel;
    }

    const dmChannel = await this.prisma.channel.create({
      data: {
        isPublic: false,
        name: crypto.randomBytes(16).toString('hex'),
        owner: {
          connect: { id: userId },
        },
        type: 'DM',
        users: {
          connect: [{ id: userId }, { id: targetUserId }],
        },
      },
    });

    return dmChannel;
  }

  async findAll(query: QueryChannelDto, userId: string) {
    console.log(query);

    const channels = await this.prisma.channel.findMany({
      include: {
        users: { select: this.userSelect },
      },
      where: {
        users: {
          some: { id: userId },
        },
      },
    });

    return channels;
  }

  async findAllDMChannels(userId: string) {
    const channels = await this.prisma.channel.findMany({
      include: {
        users: {
          select: this.userSelect,
        },
      },
      where: {
        type: 'DM',
        users: {
          some: { id: userId },
        },
      },
    });

    return channels;
  }

  async findMessages(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      include: {
        messages: {
          include: {
            author: {
              select: this.userSelect,
            },
          },
        },
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
      include: {
        users: { select: this.userSelect },
      },
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

  async kickUserFromChannel(channelId: string, userId: string, targetUserId: string) {
    const channel = await this.findOne(channelId, userId);

    if (channel.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this channel');
    }

    const updatedChannel = await this.prisma.channel.update({
      data: {
        users: {
          disconnect: { id: targetUserId },
        },
      },
      where: { id: channelId },
    });

    return updatedChannel;
  }

  async leaveChannel(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      include: {
        users: { select: this.userSelect },
      },
      where: {
        id,
        users: { some: { id: userId } },
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found or you are not a member of this channel');
    }

    if (channel.ownerId === userId) {
      throw new ForbiddenException('You cannot leave a channel you own');
    }
    const updatedChannel = await this.prisma.channel.update({
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
      where: { id },
    });
    return updatedChannel;
  }

  async remove(id: string, userId: string) {
    const channel = await this.findOne(id, userId);

    if (channel.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this channel');
    }

    if (channel.users.length > 1) {
      throw new ForbiddenException('You cannot delete a channel with other members still in it');
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
