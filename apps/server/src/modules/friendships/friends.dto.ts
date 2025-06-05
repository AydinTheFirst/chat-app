import { FriendRequestStatus } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateFriendRequestDto {
  @IsString()
  to: string;
}

export class UpdateFriendRequestDto {
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
