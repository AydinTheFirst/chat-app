import type React from "react";

import type { Channel } from "dactoly.js";

export function getChannelDisplayInfo(channel: Channel, selfUserId: string) {
  const isDM = channel.type === "DM";

  if (isDM) {
    const otherUser = channel.users?.find((user) => user.id !== selfUserId);
    return {
      ...channel,
      description: otherUser?.username || "Unknown User",
      displayName: otherUser?.profile?.displayName || "Unknown User",
      icon: otherUser?.profile?.avatarUrl || null
    };
  }

  return {
    ...channel,
    description: channel.description || "No Description",
    displayName: channel.name,
    icon: null
  };
}

export function getFormData(e: React.FormEvent<HTMLFormElement>) {
  const formData = new FormData(e.currentTarget);
  const data: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (!value) continue;
    if (value instanceof File) continue; // Skip files
    data[key] = value.toString();
  }

  return data;
}
