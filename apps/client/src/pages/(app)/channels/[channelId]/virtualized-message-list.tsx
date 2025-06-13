import { useEffect, useRef } from "react";

import { useMessages } from "~/store/hooks";
import { useReadStatusStore } from "~/store/read-status-store";

import MessageBubble from "./message-bubble";

interface MessageListProps {
  channelId: string;
}

export default function MessageList({ channelId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = useMessages(channelId);

  const updateStatus = useReadStatusStore((s) => s.updateStatus);

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    updateStatus(lastMessage.channelId, lastMessage.id);
  }, [messages, updateStatus]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className='text-center'>
        <p>No messages yet start the conversation.</p>
      </div>
    );
  }

  return (
    <div className='grid gap-1'>
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          prevMessage={messages[messages.indexOf(m) - 1]}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
