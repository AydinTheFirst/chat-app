import type { Channel, User } from "server-types";

import type { ChannelWithUsers } from "~/types";

export const getAvatar = (user: User) => {
  if (user.avatarUrl) return user.avatarUrl;
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`;
};

export const getIcon = (channel: Channel) => {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${channel.name}`;
};

export const getChannelInfo = (
  channel: ChannelWithUsers,
  currentUser: User
) => {
  const isDM = channel.type === "DM";

  const displayName = isDM
    ? channel.users.find((u) => u.id !== currentUser?.id)?.displayName
    : channel.name;

  const avatar = isDM
    ? getAvatar(channel.users.find((u) => u.id !== currentUser?.id) as User)
    : getIcon(channel);

  const description = isDM
    ? channel.users.find((u) => u.id !== currentUser?.id)?.username
    : channel.description || `${channel.users.length} members`;

  return {
    avatar,
    description,
    displayName,
    isDM
  };
};
