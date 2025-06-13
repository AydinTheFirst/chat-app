import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateMessageDto implements Partial<Prisma.MessageCreateInput> {
  @IsString()
  channelId: string;

  @IsString()
  content: string;
}

export class QueryMessageDto extends BaseQueryDto {
  @IsString()
  channelId: string;
}

export class UpdateMessageDto implements Partial<Prisma.MessageUpdateInput> {
  @IsOptional()
  @IsString()
  content?: string;
}
