import type { Channel, Friendship, Message, User } from "server-types";

export interface ChannelWithUsers extends Channel {
  users: User[];
}

export interface FriendshipWithUser extends Friendship {
  from: User;
  to: User;
}

export interface MessageWithAuthor extends Message {
  author: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    total: number;
  };
}
