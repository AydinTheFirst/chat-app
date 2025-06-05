import { $Enums, Prisma } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateChannelDto implements Partial<Prisma.ChannelCreateInput> {
  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  name: string;

  @IsEnum($Enums.ChannelType)
  @IsOptional()
  type?: $Enums.ChannelType;

  @IsOptional()
  @IsString({ each: true })
  userIds: string[];
}

export class QueryChannelDto extends BaseQueryDto {}

export class UpdateChannelDto implements Partial<Prisma.ChannelUpdateInput> {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
