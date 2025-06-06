import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './password.dto';
import { PasswordService } from './password.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Patch('password')
  @UseGuards(AuthGuard)
  updatePassword(@GetUser('id') userId: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.passwordService.updatePassword(userId, updatePasswordDto);
  }
}
