import { Button, Navbar, NavbarContent } from "@heroui/react";
import { Channel, plainToInstance } from "dactoly.js";
import { LucideEllipsisVertical } from "lucide-react";
import { useParams } from "react-router";

import SidebarToggler from "~/components/sidebar-toggler";
import TypingIndicator from "~/components/typing-indicator";
import { useAuth } from "~/hooks/use-auth";
import { getChannelDisplayInfo } from "~/lib/utils";
import { useChannelStore } from "~/store/channel-store";
import { useMessages } from "~/store/hooks";

import ChannelInfoModal from "./channel-info";
import CreateInvite from "./create-invite";
import MessageInput from "./message-input";
import VirtualizedMessageList from "./virtualized-message-list";

export default function Page() {
  const { channelId } = useParams<{ channelId: string }>();
  const channel = useChannelStore((s) => s.channels[channelId!]);
  const channelMessages = useMessages(channelId!);
  const { user } = useAuth();

  const channelInfo = getChannelDisplayInfo(channel, user.id);

  return (
    <div className='flex h-screen flex-col'>
      <Navbar
        className='bg-content1 shadow'
        maxWidth='full'
      >
        <NavbarContent justify='start'>
          <SidebarToggler className='md:hidden' />
          <h2 className='truncate text-xl font-bold'>
            {channel.type === "DM" ? "@" : "#"}
            {channelInfo.displayName}
          </h2>
        </NavbarContent>
        <NavbarContent justify='end'>
          <ChannelInfoModal channel={plainToInstance(Channel, channel)} />
          {channel.type === "GROUP" && <CreateInvite />}
          <Button
            isIconOnly
            variant='light'
          >
            <LucideEllipsisVertical />
          </Button>
        </NavbarContent>
      </Navbar>

      <main className='flex-1 overflow-y-auto'>
        <div className='p-4'>
          <VirtualizedMessageList messages={channelMessages} />
        </div>
      </main>

      <div className='relative'>
        <TypingIndicator channelId={channel.id} />
      </div>
      <MessageInput />
    </div>
  );
}
