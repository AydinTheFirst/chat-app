import { Button, Card, CardBody, Textarea } from "@heroui/react";
import {
  LucideEllipsisVertical,
  LucideSend,
  LucideSticker
} from "lucide-react";
import React, { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";

import type { ChannelWithUsers, MessageWithAuthor } from "~/types";

import EmojiPicker from "~/components/emoji-picker";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";
import { useSocket } from "~/lib/use-socket";

import type { Route } from "./+types/page";

import ChannelInfoModal from "./channel-info";
import CreateInvite from "./create-invite";
import MessageBubble from "./message-bubble";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { channelId } = params;

  if (!channelId) {
    throw new Response("Channel ID is required", { status: 400 });
  }

  const { data: channel } = await http.get<ChannelWithUsers>(
    `/channels/${channelId}`
  );

  if (!channel) {
    throw new Response("Channel not found", { status: 404 });
  }

  const { data: messages } = await http.get<MessageWithAuthor[]>(
    `/channels/${channelId}/messages`
  );

  return { channel, messages };
};

export default function Page() {
  const [messages, setMessages] = React.useState<MessageWithAuthor[]>([]);
  const { channel, messages: _messages } = useLoaderData<typeof clientLoader>();
  const socket = useSocket();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    setMessages(_messages);
  }, [_messages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", channel.id);

    socket.on("joined", (channelId: string) => {
      console.log(`Joined channel: ${channelId}`);
    });

    socket.on("left", (channelId: string) => {
      console.log(`Left channel: ${channelId}`);
    });

    socket.on("messageCreate", (message: MessageWithAuthor) => {
      if (message.channelId !== channel.id) return;

      setMessages((prev) => [...prev, message]);

      if (currentUser?.id !== message.authorId) {
        const audio = new Audio("/assets/notification.mp3");
        audio.play();
      }
    });

    socket.on("messageUpdate", (updatedMessage: MessageWithAuthor) => {
      if (updatedMessage.channelId !== channel.id) return;

      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
      );
    });

    socket.on("messageDelete", (deletedMessage: MessageWithAuthor) => {
      setMessages((prev) => prev.filter((m) => m.id !== deletedMessage.id));
    });

    return () => {
      socket.off("messageCreate");
      socket.off("joined");
      socket.emit("leave", channel.id);
    };
  }, [socket, channel, currentUser]);

  return (
    <div className='flex h-screen flex-col'>
      <Card
        className='dark:bg-[#1D1F1F]'
        radius='none'
        shadow='none'
      >
        <CardBody>
          <div className='flex justify-between'>
            <div>
              <ChannelInfoModal channel={channel} />
            </div>
            <div className='flex justify-end gap-3'>
              {channel.type === "GROUP" && <CreateInvite />}
              <Button
                isIconOnly
                variant='light'
              >
                <LucideEllipsisVertical />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <main className='flex-1 overflow-x-hidden overflow-y-auto'>
        <div className='container grid gap-3 py-10'>
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
            />
          ))}

          <div ref={bottomRef} />

          {messages.length === 0 && (
            <div className='text-center text-gray-500'>
              No messages yet. Start the conversation!
            </div>
          )}
        </div>
      </main>

      <MessageInput />
    </div>
  );
}

function MessageInput() {
  const [message, setMessage] = useState<string>("");
  const { channel } = useLoaderData<typeof clientLoader>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("content", message);
    formData.append("channelId", channel.id);

    const data = Object.fromEntries(formData.entries());

    try {
      await http.post("/messages", data);
      setMessage("");
    } catch (error) {
      handleError(error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      console.log("Submitting form:", form);
      form?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };

  return (
    <div className='relative'>
      {showEmojiPicker && (
        <div className='absolute bottom-20 left-4 z-10'>
          <EmojiPicker
            onSelect={(emoji) => setMessage((prev) => prev + emoji)}
          />
        </div>
      )}
      <Card
        className='dark:bg-[#1D1F1F]'
        radius='none'
        shadow='none'
      >
        <CardBody>
          <form
            className='flex items-center gap-1'
            onSubmit={handleSubmit}
          >
            <Button
              isIconOnly
              onPress={() => setShowEmojiPicker((prev) => !prev)}
              variant='light'
            >
              <LucideSticker />
            </Button>
            <Textarea
              fullWidth
              minRows={1}
              name='content'
              onKeyDown={handleKeyDown}
              onValueChange={setMessage}
              placeholder='Type your message...'
              value={message}
              variant='bordered'
            />
            <Button
              isIconOnly
              type='submit'
              variant='light'
            >
              <LucideSend />
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
