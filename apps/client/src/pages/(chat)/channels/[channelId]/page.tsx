import {
  Button,
  Card,
  CardBody,
  Navbar,
  NavbarContent,
  Textarea
} from "@heroui/react";
import { Channel, Message, plainToInstance } from "dictoly.js";
import {
  LucideEllipsisVertical,
  LucideSend,
  LucideSticker
} from "lucide-react";
import React, { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";

import EmojiPicker from "~/components/emoji-picker";
import TypingIndicator from "~/components/typing-indicator";
import { useAuth } from "~/hooks/use-auth";
import { useDictoly } from "~/hooks/use-dictoly";
import { dictoly } from "~/lib/dictoly";
import { handleError, http } from "~/lib/http";

import type { Route } from "./+types/page";

import SidebarToggler from "../../sidebar-toggler";
import ChannelInfoModal from "./channel-info";
import CreateInvite from "./create-invite";
import MessageBubble from "./message-bubble";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { channelId } = params;

  if (!channelId) {
    throw new Response("Channel ID is required", { status: 400 });
  }

  const channel = await dictoly.channels.getById(channelId);

  if (!channel) {
    throw new Response("Channel not found", { status: 404 });
  }

  const messages = await dictoly.channels.getMessages(channelId);

  return { channel, messages };
};

export default function Page() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const { channel, messages: _messages } = useLoaderData<typeof clientLoader>();
  const { dictolyClient } = useDictoly();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    setMessages(plainToInstance(Message, _messages));
  }, [_messages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!dictolyClient) return;

    dictolyClient.ws.emit("join", channel.id);

    dictolyClient.ws.on("messageCreate", (message) => {
      if (message.channelId !== channel.id) return;

      setMessages((prev) => [...prev, message]);

      if (currentUser?.id !== message.authorId) {
        const audio = new Audio("/assets/notification.mp3");
        audio.play();
      }
    });

    dictolyClient.ws.on("messageUpdate", (updatedMessage: Message) => {
      if (updatedMessage.channelId !== channel.id) return;

      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
      );
    });

    dictolyClient.ws.on("messageDelete", (deletedMessage: Message) => {
      setMessages((prev) => prev.filter((m) => m.id !== deletedMessage.id));
    });

    return () => {
      dictolyClient.ws.off("messageCreate");
      dictolyClient.ws.off("messageUpdate");
      dictolyClient.ws.off("messageDelete");
      dictolyClient.ws.emit("leave", channel.id);
    };
  }, [dictolyClient, channel, currentUser]);

  return (
    <div className='flex h-screen flex-col'>
      <Navbar
        className='bg-content1 shadow'
        maxWidth='full'
      >
        <NavbarContent justify='start'>
          <SidebarToggler className='md:hidden' />
          <ChannelInfoModal channel={plainToInstance(Channel, channel)} />
        </NavbarContent>
        <NavbarContent justify='end'>
          {channel.type === "GROUP" && <CreateInvite />}
          <Button
            isIconOnly
            variant='light'
          >
            <LucideEllipsisVertical />
          </Button>
        </NavbarContent>
      </Navbar>

      <main className='container flex-1 overflow-x-hidden overflow-y-auto py-4'>
        <div className='flex flex-col gap-3'>
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
      <div className='relative'>
        <TypingIndicator channelId={channel.id} />
      </div>
      <MessageInput />
    </div>
  );
}

function MessageInput() {
  const [message, setMessage] = useState<string>("");
  const { channel } = useLoaderData<typeof clientLoader>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { dictolyClient } = useDictoly();
  const [lastEvent, setLastEvent] = useState<string>("");

  useEffect(() => {
    const event = message.length > 0 ? "startTyping" : "stopTyping";
    if (lastEvent === event) return;
    setLastEvent(event);
    dictoly.ws.emit(event, { channelId: channel.id });
  }, [dictolyClient, message, channel, lastEvent]);

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
