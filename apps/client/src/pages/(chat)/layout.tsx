import { cn } from "@heroui/react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { AuthProvider } from "~/context/auth-context";
import { SidebarProvider } from "~/context/sidebar-context";
import { useSidebar } from "~/hooks/use-sidebar";
import { useDevice } from "~/hooks/use-viewport";
import { dictoly } from "~/lib/dictoly";

import Sidebar from "./sidebar";

const SIDEBAR_WIDTH = 320; // px

export const clientLoader = async () => {
  const channels = await dictoly.channels.getAll();
  return { channels };
};

export default function Layout() {
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
