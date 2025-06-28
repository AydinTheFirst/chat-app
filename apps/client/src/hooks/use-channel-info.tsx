import type { Channel, User } from "dactoly.js";

import { useMemo } from "react";

interface UseChannelInfoProps {
  channel: Channel;
  user: User;
}

export default function useChannelInfo({ channel, user }: UseChannelInfoProps) {
  return useMemo(() => channelDisplay(channel, user), [channel, user]);
}

function channelDisplay(channel: Channel, user: User) {
  let displayName = channel.name;
  let description = channel.description;
  let avatarUrl;
  const type = channel.type;

  if (type === "DM") {
    const otherUser = channel.users.find((u) => u.id !== user.id);
    displayName = otherUser?.profile?.displayName || "Direct Message";
    description = otherUser?.username;
    avatarUrl = otherUser?.profile?.avatarUrl;
  }

  if (type === "GROUP") {
    displayName = channel.name || "Group Channel";
    description = channel.description || "Group Channel Description";
  }

  return {
    avatarUrl,
    description,
    displayName,
    type
  };
}
