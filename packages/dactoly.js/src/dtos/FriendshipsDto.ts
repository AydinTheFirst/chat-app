import { FriendRequestStatus } from '~/enums';

export class CreateFriendshipDto {
  userId: string;
}

export class UpdateFriendshipDto {
  status: FriendRequestStatus;
}
