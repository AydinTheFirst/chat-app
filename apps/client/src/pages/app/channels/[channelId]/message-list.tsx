import type { Message } from "dactoly.js";

import { useEffect, useMemo, useRef } from "react";

import { useDactoly } from "~/hooks/use-dactoly";
import useMessageStore from "~/store/message-store";

import MessageItem from "./message-item";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages: initialMessages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { dactoly } = useDactoly();
  const { addMessage, clearMessages, deleteMessage, messages, updateMessage } =
    useMessageStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    clearMessages();
    initialMessages.forEach(addMessage);
  }, [addMessage, clearMessages, initialMessages]);

  useEffect(() => {
    const socket = dactoly.ws;
    socket.on("messageCreate", addMessage);
    socket.on("messageUpdate", updateMessage);
    socket.on("messageDelete", (msg) => deleteMessage(msg.id));
    return () => {
      socket.off("messageCreate", addMessage);
      socket.off("messageUpdate", updateMessage);
      socket.off("messageDelete", (msg) => deleteMessage(msg.id));
    };
  }, [dactoly, addMessage, updateMessage, deleteMessage]);

  const sortedMessages = useMemo(() => {
    return Object.values(messages).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  return (
    <ul className='grid gap-3'>
      {sortedMessages.map((message) => (
        <li key={message.id}>
          <MessageItem message={message} />
        </li>
      ))}
      <div ref={bottomRef} />
    </ul>
  );
}
