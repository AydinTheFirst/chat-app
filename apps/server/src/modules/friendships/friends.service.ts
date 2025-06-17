import { BadRequestException, Injectable } from '@nestjs/common';

import { Prisma, PrismaService } from '~/database';

import { CreateFriendRequestDto, UpdateFriendRequestDto } from './friends.dto';

@Injectable()
export class FriendsService {
  friendshipInclude: Prisma.FriendshipInclude = {
    from: { select: { id: true, profile: true, username: true } },
    to: { select: { id: true, profile: true, username: true } },
  };

  constructor(private prisma: PrismaService) {}

  async acceptFriendRequest(id: string, userId: string) {
    const friendship = await this.findOne(id, userId);

    if (friendship.toId !== userId) {
      throw new BadRequestException('You can only accept friend requests sent to you.');
    }

    if (friendship.status !== 'PENDING') {
      throw new BadRequestException('Friend request is not pending.');
    }

    const updatedFriendRequest = await this.prisma.friendship.update({
      data: {
        status: 'ACCEPTED',
      },
      where: { id },
    });

    return updatedFriendRequest;
  }

  async create({ to }: CreateFriendRequestDto, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ id: to }, { username: to }] },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (userId === user.id) {
      throw new BadRequestException('You cannot send a friend request to yourself.');
    }

    const existingRequest = await this.prisma.friendship.findFirst({
      where: {
        fromId: userId,
        toId: user.id,
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists.');
    }

    const friend = await this.prisma.friendship.create({
      data: {
        from: { connect: { id: userId } },
        to: { connect: { id: user.id } },
      },
    });

    return friend;
  }

  async findAll(userId: string) {
    const requests = await this.prisma.friendship.findMany({
      include: this.friendshipInclude,
      where: {
        OR: [{ fromId: userId }, { toId: userId }],
        status: 'ACCEPTED',
      },
    });

    return requests;
  }

  async findOne(id: string, userId: string) {
    const friend = await this.prisma.friendship.findFirst({
      include: this.friendshipInclude,
      where: {
        id,
        OR: [{ fromId: userId }, { toId: userId }],
      },
    });

    if (!friend) {
      throw new BadRequestException('Friend request not found or you are not the requester.');
    }

    return friend;
  }

  async findPendingRequests(userId: string) {
    const pendingRequests = await this.prisma.friendship.findMany({
      include: this.friendshipInclude,
      where: {
        status: 'PENDING',
        toId: userId,
      },
    });

    return pendingRequests;
  }

  async isFriend(userId: string, targetUserId: string) {
    // Önce her iki kullanıcıyı da çek, isBot bilgisini alalım
    const users = await this.prisma.user.findMany({
      select: { id: true, isBot: true },
      where: {
        id: { in: [userId, targetUserId] },
      },
    });

    // Eğer userId veya targetUserId botsa true dön
    if (users.some((u) => u.isBot)) {
      return true;
    }

    // Değilse friendship kontrolü yap
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { fromId: userId, status: 'ACCEPTED', toId: targetUserId },
          { fromId: targetUserId, status: 'ACCEPTED', toId: userId },
        ],
      },
    });

    return !!friendship;
  }

  async rejectFriendRequest(id: string, userId: string) {
    const friendship = await this.findOne(id, userId);

    if (friendship.toId !== userId) {
      throw new BadRequestException('You can only reject friend requests sent to you.');
    }

    if (friendship.status !== 'PENDING') {
      throw new BadRequestException('Friend request is not pending.');
    }

    const updatedFriendRequest = await this.prisma.friendship.update({
      data: {
        status: 'REJECTED',
      },
      where: { id },
    });

    return updatedFriendRequest;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    const friendship = await this.prisma.friendship.delete({
      where: { id },
    });

    return friendship;
  }

  async update(id: string, updateFriendDto: UpdateFriendRequestDto, userId: string) {
    const friendship = await this.findOne(id, userId);

    if (friendship.fromId !== userId) {
      throw new BadRequestException('You can only update your own friend requests.');
    }

    const updatedFriendRequest = await this.prisma.friendship.update({
      data: {
        status: updateFriendDto.status,
      },
      where: { id },
    });

    return updatedFriendRequest;
  }
}
