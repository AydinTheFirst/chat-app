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
