import { cn } from "@heroui/react";
import { Channel, plainToInstance } from "dactoly.js";
import { useEffect } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router";

import { AuthProvider } from "~/context/auth-context";
import { SidebarProvider } from "~/context/sidebar-context";
import { useSidebar } from "~/hooks/use-sidebar";
import { useDevice } from "~/hooks/use-viewport";
import { dactoly } from "~/lib/dactoly";
import { useChannelStore } from "~/store/channel-store";

import Sidebar from "./sidebar";

const SIDEBAR_WIDTH = 320; // px

export const clientLoader = async () => {
  const channels = await dactoly.channels.getAll();
  return { channels };
};

export default function Layout() {
  const { channels } = useLoaderData<typeof clientLoader>();
  const setChannels = useChannelStore((s) => s.setChannels);

  useEffect(() => {
    setChannels(plainToInstance(Channel, channels));
  }, [channels, setChannels]);

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
        className={cn("bg-content2 transition-width")}
        style={{
          width: `calc(100vw - ${isOpen ? SIDEBAR_WIDTH : 0}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
}
