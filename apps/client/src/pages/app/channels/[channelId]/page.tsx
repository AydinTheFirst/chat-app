import { Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import { useEffect } from "react";
import { type ClientLoaderFunctionArgs, useLoaderData } from "react-router";

import SidebarToggler from "~/components/sidebar-toggler";
import { useAuth } from "~/hooks/use-auth";
import useChannelInfo from "~/hooks/use-channel-info";
import { useDactoly } from "~/hooks/use-dactoly";
import { useSidebar } from "~/hooks/use-sidebar";
import dactoly from "~/lib/dactoly";

import ChannelInfoModal from "./channel-info";
import ChatInput from "./chat-input";
import InviteUsersModal from "./invite-users";
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
  const { user } = useAuth();
  const channelInfo = useChannelInfo({ channel, user });

  useEffect(() => {
    const socket = dactoly.ws;

    socket.emit("join", channel.id);

    return () => {
      socket.emit("leave", channel.id);
    };
  });

  return (
    <div className='flex h-full flex-col gap-5'>
      <Navbar
        className='bg-transparent'
        isBordered
        maxWidth='full'
      >
        <NavbarContent justify='start'>
          {!isOpen && <SidebarToggler />}
          <h1 className='block truncate text-lg font-semibold'>
            {channel.type === "DM" ? "@" : "#"}
            {channelInfo.displayName}
          </h1>
        </NavbarContent>
        <NavbarContent justify='end'>
          <NavbarItem>
            <ChannelInfoModal channel={channel} />
          </NavbarItem>
          <NavbarItem>
            <InviteUsersModal channel={channel} />
          </NavbarItem>
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
