import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateChannelDto implements Partial<Prisma.ChannelCreateInput> {
  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  name: string;

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
