import type { Channel } from "dictoly.js";
import type React from "react";

import { type User } from "dictoly.js";

import { CDN_URL } from "~/config";

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

export const getChannelInfo = (channel: Channel, currentUser: User) => {
  switch (channel.type) {
    case "DM": {
      const user = channel.users?.find((u) => u.id !== currentUser.id);

      const description = user?.profile?.displayName || "Unknown User";
      const name = user?.username || "Unknown User";
      const icon = user?.profile?.avatarUrl
        ? new URL(user.profile.avatarUrl, CDN_URL).toString()
        : null;

      return { description, icon, isDM: true, name, user };
    }

    case "GROUP":
      return {
        description: channel.description || "No description",
        icon: null,
        isDM: false,
        name: channel.name
      };
  }
};
