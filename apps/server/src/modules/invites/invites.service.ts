import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import crypto from 'crypto';

import { PrismaService } from '~/database';

import { ChannelsService } from '../channels';

@Injectable()
export class InvitesService {
  constructor(
    private prisma: PrismaService,
    private channelsService: ChannelsService,
  ) {}

  async create(channelId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (channel.ownerId !== user.id) {
      throw new ForbiddenException("You can't create an invite for this channel!");
    }

    const code = crypto.randomBytes(16).toString('hex');

    const invite = await this.prisma.inviteLink.create({
      data: {
        channel: { connect: { id: channelId } },
        code,
      },
    });

    return invite;
  }

  async joinByCode(code: string, userId: string) {
    const invite = await this.prisma.inviteLink.findUnique({
      include: { channel: true },
      where: { code },
    });

    if (!invite) throw new NotFoundException('Davet linki geçersiz');

    const isMember = await this.prisma.channel.findFirst({
      where: {
        id: invite.channelId,
        users: { some: { id: userId } },
      },
    });

    if (isMember) {
      return invite;
    }

    await this.channelsService.joinChannel(invite.channelId, userId);

    return invite;
  }
}
