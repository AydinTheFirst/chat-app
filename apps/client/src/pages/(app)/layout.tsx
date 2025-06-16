import { cn } from "@heroui/react";
import { Channel, Friendship, plainToInstance, User } from "dactoly.js";
import { useEffect } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router";

import { AuthProvider } from "~/context/auth-context";
import { SidebarProvider } from "~/context/sidebar-context";
import { useSidebar } from "~/hooks/use-sidebar";
import { useDevice } from "~/hooks/use-viewport";
import { dactoly } from "~/lib/dactoly";
import { useChannelStore } from "~/store/channel-store";
import { useFriendshipStore } from "~/store/friendship-store";
import { useMessageStore } from "~/store/message-store";
import { useReadStatusStore } from "~/store/read-status-store";
import { useUserStore } from "~/store/user-store";

import Sidebar from "./sidebar";

const SIDEBAR_WIDTH = 320; // px

export const clientLoader = async () => {
  const channels = await dactoly.channels.fetch();
  const friendships = await dactoly.friendships.fetch();
  return { channels, friendships };
};

export default function Layout() {
  const { channels, friendships } = useLoaderData<typeof clientLoader>();
  const setChannels = useChannelStore((s) => s.setChannels);
  const fetchMessages = useMessageStore((s) => s.fetchMessages);
  const setUsers = useUserStore((s) => s.setUsers);
  const setFriendships = useFriendshipStore((s) => s.setFriendships);
  const fetchReadStatus = useReadStatusStore((state) => state.fetchStatus);

  useEffect(() => {
    setChannels(plainToInstance(Channel, channels));
    channels.forEach((channel) => {
      if (channel.users && channel.users.length > 0) {
        setUsers(channel.users.map((u) => plainToInstance(User, u)));
      }

      fetchReadStatus(channel.id);
      fetchMessages(channel.id);
    });
  }, [channels, setChannels, fetchMessages, setUsers, fetchReadStatus]);

  useEffect(() => {
    setFriendships(friendships.map((f) => plainToInstance(Friendship, f)));
  }, [friendships, setFriendships]);

  return (
    <AuthProvider>
      <SidebarProvider>
        <SidebarLayout>
          <Outlet />
        </SidebarLayout>
      </SidebarProvider>
    </AuthProvider>
  );
}

function SidebarLayout({ children }: React.PropsWithChildren) {
  const { isOpen, onOpenChange } = useSidebar();

  const { isMobile } = useDevice();
  const { pathname } = useLocation();

  useEffect(() => {
    onOpenChange(!isMobile);
  }, [pathname, isMobile, onOpenChange]);

  return (
    <div className='flex overflow-hidden'>
      <div
        className='transition-all'
        style={{
          marginLeft: isOpen ? 0 : -SIDEBAR_WIDTH,
          width: SIDEBAR_WIDTH
        }}
      >
        <Sidebar />
      </div>
      <div
        className={cn("transition-width")}
        style={{
          width: `calc(100vw - ${isOpen ? SIDEBAR_WIDTH : 0}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
}
