import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, PrismaService } from '~/database';

import { UpdateProfileDto } from './profiles.dto';

@Injectable()
export class ProfilesService {
  profileInclude: Prisma.ProfileInclude = {
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  };

  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      include: this.profileInclude,
      where: {
        userId: userId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        profile: true,
        username: true,
      },
      where: { id: userId },
    });

    return user;
  }

  async updateMyProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.prisma.profile.upsert({
      create: {
        user: { connect: { id: userId } },
        ...updateProfileDto,
        displayName: updateProfileDto.displayName ?? user.username,
      },
      include: this.profileInclude,
      update: updateProfileDto,
      where: {
        userId: userId,
      },
    });

    return profile;
  }
}
