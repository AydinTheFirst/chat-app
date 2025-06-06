import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  displayName?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
