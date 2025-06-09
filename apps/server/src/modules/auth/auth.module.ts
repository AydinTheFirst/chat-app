import { Module } from '@nestjs/common';

import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PasswordService, TokenService],
})
export class AuthModule {}
