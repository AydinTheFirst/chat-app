import { Button, Input, Navbar, NavbarContent } from "@heroui/react";
import { LucidePlus, LucideSearch } from "lucide-react";
import { useEffect } from "react";
import { type ClientLoaderFunctionArgs, useLoaderData } from "react-router";

import SidebarToggler from "~/components/sidebar-toggler";
import { useDactoly } from "~/hooks/use-dactoly";
import { useSidebar } from "~/hooks/use-sidebar";
import dactoly from "~/lib/dactoly";

import ChatInput from "./chat-input";
import MessageList from "./message-list";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { channelId } = params;

  if (!channelId) {
    throw new Error("Channel ID is required");
  }

  const channel = await dactoly.channels.fetchById(channelId);

  if (!channel) {
    throw new Error(`Channel with ID ${channelId} not found`);
  }

  const messages = await dactoly.messages.fetch({ channelId, limit: 100 });

  return { channel, messages: messages.items };
};

export default function Channel() {
  const { isOpen } = useSidebar();
  const { channel, messages } = useLoaderData<typeof clientLoader>();
  const { dactoly } = useDactoly();

  useEffect(() => {
    const socket = dactoly.ws;

    socket.emit("join", channel.id);

    return () => {
      socket.emit("leave", channel.id);
    };
  });

  return (
    <div className='flex h-full flex-col gap-3'>
      <Navbar
        className='bg-transparent'
        maxWidth='full'
      >
        <NavbarContent justify='start'>
          {!isOpen && <SidebarToggler />}
          <h1 className='truncate text-lg font-semibold'>#{channel.name}</h1>
        </NavbarContent>
        <NavbarContent justify='end'>
          <Button
            isIconOnly
            variant='light'
          >
            <LucidePlus size={20} />
          </Button>
          <Input
            className='max-w-xs'
            endContent={
              <LucideSearch
                className='text-gray-400'
                size={20}
              />
            }
            placeholder='Search...'
          />
        </NavbarContent>
      </Navbar>
      <main className='flex-1 overflow-auto'>
        <div className='container'>
          <MessageList messages={messages} />
        </div>
      </main>
      <footer className='mb-3'>
        <ChatInput channelId={channel.id} />
      </footer>
    </div>
  );
}
