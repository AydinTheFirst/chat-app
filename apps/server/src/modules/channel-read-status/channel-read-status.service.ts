import { Injectable } from '@nestjs/common';

import { PrismaService } from '~/database';

@Injectable()
export class ChannelReadStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(userId: string, channelId: string) {
    return this.prisma.channelReadStatus.findUnique({
      include: {
        lastReadMessage: true,
      },
      where: {
        userId_channelId: {
          channelId,
          userId,
        },
      },
    });
  }

  async updateStatus(userId: string, channelId: string, lastReadMessageId: string) {
    return this.prisma.channelReadStatus.upsert({
      create: {
        channelId,
        lastReadMessageId,
        userId,
      },
      update: {
        lastReadMessageId,
      },
      where: {
        userId_channelId: {
          channelId,
          userId,
        },
      },
    });
  }
}
