import type { Message } from "dactoly.js";

import React, { useEffect, useRef } from "react";

import MessageBubble from "./message-bubble";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

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
