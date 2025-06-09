import { useChannelStore } from "~/store/channel-store";
import { useUserStore } from "~/store/user-store";

export default function useFormattedContent(content: string): string {
  const users = useUserStore((s) => s.users);
  const channels = useChannelStore((s) => s.channels);

  const formattedContent = content
    .replace(/@([0-9a-fA-F-]{36})/g, (match, userId) => {
      const user = users[userId];

      if (user) {
        return `[${user.profile?.displayName}](/users/${userId})`;
      }

      return match;
    })
    .replace(/#([0-9a-fA-F-]{36})/g, (match, channelId) => {
      const channel = channels[channelId];

      if (channel) {
        return `[${channel.name}](/channels/${channelId})`;
      }

      return match;
    });

  return formattedContent;
}
