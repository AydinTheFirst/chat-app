import { Injectable, NotFoundException } from '@nestjs/common';
import crypto from 'crypto';
import { DateTime } from 'ts-luxon';

import { Prisma, PrismaService } from '~/database';

import { CreateApplicationDto, UpdateApplicationDto } from './applications.dto';

@Injectable()
export class ApplicationsService {
  includeBot: Prisma.ApplicationInclude = {
    bot: {
      include: {
        profile: true,
        tokens: true,
      },
    },
  };

  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateApplicationDto) {
    const app = await this.prisma.application.create({
      data: {
        description: dto.description,
        name: dto.name,
        ownerId,
      },
    });

    const bot = await this.prisma.user.create({
      data: {
        application: { connect: { id: app.id } },
        profile: {
          create: {
            displayName: dto.name,
          },
        },
        roles: ['BOT'],
        username: `${dto.name}_bot_${Date.now()}`,
      },
    });

    await this.prisma.application.update({
      data: { botId: bot.id },
      where: { id: app.id },
    });

    return this.prisma.application.findUnique({
      include: this.includeBot,
      where: { id: app.id },
    });
  }

  async createToken(ownerId: string, appId: string) {
    const app = await this.findOne(ownerId, appId);

    const token = await this.prisma.token.create({
      data: {
        expiresAt: DateTime.now().plus({ years: 1 }).toJSDate(),
        token: crypto.randomBytes(32).toString('hex'),
        userId: app.bot.id,
      },
    });

    return token;
  }

  async findAll(ownerId: string) {
    return this.prisma.application.findMany({
      include: this.includeBot,
      where: { ownerId },
    });
  }

  async findOne(ownerId: string, appId: string) {
    const app = await this.prisma.application.findFirst({
      include: this.includeBot,
      where: {
        id: appId,
        ownerId,
      },
    });

    if (!app) {
      throw new NotFoundException(`Application ${appId} not found`);
    }

    return app;
  }

  async remove(ownerId: string, appId: string) {
    await this.findOne(ownerId, appId);

    await this.prisma.application.delete({
      where: { id: appId },
    });

    return { id: appId };
  }

  async update(ownerId: string, appId: string, dto: UpdateApplicationDto) {
    await this.findOne(ownerId, appId);

    return this.prisma.application.update({
      data: {
        description: dto.description,
        name: dto.name,
      },
      include: this.includeBot,
      where: { id: appId },
    });
  }
}
