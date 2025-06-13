import { useMemo } from "react";

import { useReadStatusStore } from "~/store/read-status-store";

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

export const useUnreadCount = (channelId: string) => {
  const readStatus = useReadStatusStore((state) => state.readStatus[channelId]);
  const messages = useMessages(channelId);

  return useMemo(() => {
    if (!readStatus || !messages) return 0;

    const lastReadMessageId = readStatus.lastReadMessageId;
    if (!lastReadMessageId) return messages.length;

    const lastReadIndex = messages.findIndex((m) => m.id === lastReadMessageId);
    if (lastReadIndex === -1) return messages.length;

    return messages.length - (lastReadIndex + 1);
  }, [readStatus, messages]);
};
