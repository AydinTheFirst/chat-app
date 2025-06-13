import { useMemo } from "react";

import { useReadStatusStore } from "~/store/read-status-store";

import { useChannelStore } from "./channel-store";
import { useMessageStore } from "./message-store";

export const useLastMessage = (channelId: string) => {
  let messages = useMessageStore((state) => state.messages[channelId]);
  if (!messages) return;
  messages = messages.filter((m) => m.type === "DEFAULT");
  return messages[messages.length - 1];
};

export const useMessages = (channelId: string) => {
  const messages = useMessageStore((state) => state.messages[channelId]);
  return messages || [];
};

export function useUnreadCount(channelId: string) {
  const readStatus = useReadStatusStore((s) => s.readStatus[channelId]);
  const channel = useChannelStore((s) => s.channels[channelId]);
  const messages = useMessages(channelId);

  return useMemo(() => {
    if (!readStatus || !channel || !messages) return 0;
    const lastReadMessageId = readStatus.lastReadMessageId;
    if (!lastReadMessageId) return messages.length;

    const lastReadIndex = messages.findIndex((m) => m.id === lastReadMessageId);
    if (lastReadIndex === -1) return messages.length;

    return messages.length - lastReadIndex - 1;
  }, [readStatus, channel, messages]);
}
