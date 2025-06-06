import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import argon2 from 'argon2';

import { PrismaService } from '~/database';

import { UpdatePasswordDto } from './password.dto';
@Injectable()
export class PasswordService {
  constructor(private prisma: PrismaService) {}

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const { newPassword, oldPassword } = updatePasswordDto;

    const user = await this.prisma.user.findUnique({
      select: { password: true },
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await argon2.verify(user.password, oldPassword);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const newPasswordHash = await argon2.hash(newPassword);

    await this.prisma.user.update({
      data: { password: newPasswordHash },
      where: { id: userId },
    });
  }
}
