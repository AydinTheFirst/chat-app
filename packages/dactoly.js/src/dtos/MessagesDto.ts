import { BaseQueryDto } from './BaseQueryDto';

export class CreateMessageDto {
  channelId: string;
  content: string;
}

export class QueryMessagesDto extends BaseQueryDto {
  channelId?: string;
}

export class UpdateMessageDto {
  content: string;
}
