import { IsUUID } from 'class-validator';

// dto/update-read-status.dto.ts
export class UpdateReadStatusDto {
  @IsUUID()
  channelId: string;

  @IsUUID()
  lastReadMessageId: string;
}
