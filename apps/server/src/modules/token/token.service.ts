import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '~/database';

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clear() {
    const now = new Date();
    const deletedTokens = await this.prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    this.logger.debug(`Cleared ${deletedTokens.count} expired tokens at ${now.toISOString()}`);
  }
}
