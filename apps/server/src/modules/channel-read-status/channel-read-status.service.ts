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

  async getUnreadCount(userId: string, channelId: string): Promise<number> {
    // Okunma durumu al
    const status = await this.getStatus(userId, channelId);

    if (!status || !status.lastReadMessage) {
      return this.prisma.message.count({
        where: { channelId },
      });
    }

    const lastReadAt = status.lastReadMessage.createdAt;

    // lastReadAt tarihinden sonra gelen mesajları say
    return this.prisma.message.count({
      where: {
        channelId,
        createdAt: {
          gt: lastReadAt,
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
