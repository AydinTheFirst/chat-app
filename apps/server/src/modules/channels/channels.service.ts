import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';

import { QueryService } from '~/common/services/query.service';
import { Channel, Prisma, PrismaService } from '~/database';
import { ChannelsGateway } from '~/gateways/channels.gateway';

import { FriendsService } from '../friendships/friends.service';
import { MessagesService } from '../messages/messages.service';
import { CreateChannelDto, QueryChannelDto, UpdateChannelDto } from './channels.dto';

@Injectable()
export class ChannelsService extends QueryService<Channel> {
  userSelect: Prisma.UserSelect = {
    id: true,
    profile: true,
    username: true,
  };

  channelInclude: Prisma.ChannelInclude = {
    lastMessage: true,
    owner: { select: this.userSelect },
    users: { select: this.userSelect },
  };

  constructor(
    private prisma: PrismaService,
    private friendsService: FriendsService,
    private messagesService: MessagesService,
    private channelsGateway: ChannelsGateway,
  ) {
    super(prisma.channel);
  }

  async addApplicationToChannel(channelId: string, applicationUserId: string) {
    // Kanal var mı kontrol et
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // Kullanıcı zaten kanalda mı kontrolü (opsiyonel)
    const isAlreadyInChannel = await this.prisma.channel.findFirst({
      where: {
        id: channelId,
        users: { some: { id: applicationUserId } },
      },
    });

    if (isAlreadyInChannel) {
      throw new BadRequestException('Application is already in the channel');
    }

    // Kanal kullanıcılarına application user'ı ekle
    const updatedChannel = await this.prisma.channel.update({
      data: {
        users: {
          connect: { id: applicationUserId },
        },
      },
      include: this.channelInclude,
      where: { id: channelId },
    });

    await this.messagesService.sendSystemMessage(
      updatedChannel.id,
      `Application <@${applicationUserId}> joined the channel.`,
    );

    this.channelsGateway.emitChannelUpdate(updatedChannel);

    return updatedChannel;
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
      include: this.channelInclude,
    });

    this.channelsGateway.emitChannelCreate(channel);

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
      include: this.channelInclude,
    });

    this.channelsGateway.emitChannelCreate(dmChannel);

    return dmChannel;
  }

  async findAll(_query: QueryChannelDto, userId: string) {
    const channels = await this.prisma.channel.findMany({
      include: this.channelInclude,
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
      include: this.channelInclude,
      where: {
        type: 'DM',
        users: {
          some: { id: userId },
        },
      },
    });

    return channels;
  }

  async findOne(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      include: this.channelInclude,
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

  async joinChannel(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      include: this.channelInclude,
      where: {
        id,
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found.');
    }

    const updatedChannel = await this.prisma.channel.update({
      data: {
        users: {
          connect: { id: userId },
        },
      },
      where: { id },
    });

    await this.messagesService.sendSystemMessage(
      updatedChannel.id,
      `@${userId} joined the channel.`,
    );

    return updatedChannel;
  }

  async kickUserFromChannel(channelId: string, userId: string, targetUserId: string) {
    const channel = await this.findOne(channelId, userId);

    if (userId === targetUserId) {
      throw new BadRequestException('You cannot kick yourself from the channel');
    }

    if (channel.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this channel');
    }

    if (channel.type === 'DM') {
      throw new BadRequestException('You cannot kick users from a DM channel');
    }

    const updatedChannel = await this.prisma.channel.update({
      data: {
        users: {
          disconnect: { id: targetUserId },
        },
      },
      include: this.channelInclude,
      where: { id: channelId },
    });

    await this.messagesService.sendSystemMessage(
      updatedChannel.id,
      `@${targetUserId} was kicked from the channel by @${userId}.`,
    );

    return updatedChannel;
  }

  async leaveChannel(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      include: this.channelInclude,
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

    await this.messagesService.sendSystemMessage(updatedChannel.id, `@${userId}> left the channel`);

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
      include: this.channelInclude,
      where: { id },
    });

    this.channelsGateway.emitChannelDelete(deletedChannel);

    return deletedChannel;
  }

  async update(id: string, updateChannelDto: UpdateChannelDto, userId: string) {
    const channel = await this.findOne(id, userId);

    if (channel.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this channel');
    }

    const updatedChannel = await this.prisma.channel.update({
      data: updateChannelDto,
      include: this.channelInclude,
      where: { id },
    });

    this.channelsGateway.emitChannelUpdate(updatedChannel);

    return updatedChannel;
  }
}
