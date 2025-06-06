import { PartialType } from '@nestjs/mapped-types';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  roles?: UserRole[];

  @IsString()
  username: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
