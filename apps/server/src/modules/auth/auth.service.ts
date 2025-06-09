import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';

import { PrismaService } from '~/database';

import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async login(body: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.username }],
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isValid = await argon.verify(user.password, body.password);
    if (!isValid) throw new BadRequestException('Invalid password or username');

    const token = await this.tokenService.createToken(user.id);

    return {
      ...user,
      token: token.token,
    };
  }

  async register(body: RegisterDto) {
    const isExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (isExist) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await argon.hash(body.password);

    const user = await this.usersService.create({
      password: hashedPassword,
      ...body,
    });

    return user;
  }
}
