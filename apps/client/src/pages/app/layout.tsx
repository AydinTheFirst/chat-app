import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image
} from "@heroui/react";
import { Channel, plainToInstance } from "dactoly.js";
import { Outlet, useLoaderData } from "react-router";

import SidebarToggler from "~/components/sidebar-toggler";
import { AuthProvider } from "~/context/auth-context";
import { DactolyProvider } from "~/context/dactoly-context";
import { SidebarProvider } from "~/context/sidebar-context";
import { useSidebar } from "~/hooks/use-sidebar";
import dactoly from "~/lib/dactoly";

import ChatItem from "./chat-item";
import CreateChannelModal from "./create-channel";
import SidebarUserCard from "./sidebar-user-card";

const SIDEBAR_WIDTH = 280;

export const clientLoader = async () => {
  const channels = await dactoly.channels.fetch();

  return { channels };
};

export default function Layout() {
  return (
    <SidebarProvider>
      <AuthProvider>
        <DactolyProvider>
          <SidebarLayout />
        </DactolyProvider>
      </AuthProvider>
    </SidebarProvider>
  );
}

function SidebarLayout() {
  const { isOpen } = useSidebar();
  const { channels } = useLoaderData<typeof clientLoader>();

  return (
    <div className='flex h-screen overflow-hidden'>
      <Card
        radius='none'
        style={{
          marginLeft: isOpen ? 0 : -SIDEBAR_WIDTH,
          transition: "width 0.3s ease-in-out",
          width: isOpen ? SIDEBAR_WIDTH : 0
        }}
      >
        <CardHeader className='justify-between'>
          <Image
            alt='Logo'
            className='w-8'
            radius='none'
            src='/logo.png'
          />
          <SidebarToggler />
        </CardHeader>
        <CardBody className='p-0'>
          <div className='flex-1 p-3'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='text-sm font-semibold'>Channels</h4>
              <CreateChannelModal />
            </div>
            <ul className='flex flex-col gap-2'>
              {channels.map((channel) => (
                <li key={channel.id}>
                  <ChatItem channel={plainToInstance(Channel, channel)} />
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
        <CardFooter>
          <SidebarUserCard />
        </CardFooter>
      </Card>

      <Divider orientation='vertical' />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
