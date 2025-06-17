import {
  Avatar,
  Button,
  Card,
  CardBody,
  Image,
  Link,
  User
} from "@heroui/react";
import {
  LucideCable,
  LucidePlus,
  LucideSettings,
  LucideUsers
} from "lucide-react";
import { Outlet, useLoaderData } from "react-router";

import SidebarToggler from "~/components/sidebar-toggler";
import { AuthProvider } from "~/context/auth-context";
import { DactolyProvider } from "~/context/dactoly-context";
import { SidebarProvider } from "~/context/sidebar-context";
import { useSidebar } from "~/hooks/use-sidebar";
import dactoly from "~/lib/dactoly";

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
      <aside
        className='bg-content2 transition-all'
        style={{
          marginLeft: isOpen ? 0 : -SIDEBAR_WIDTH,
          width: SIDEBAR_WIDTH
        }}
      >
        <div className='flex h-full flex-col gap-3'>
          <div className='p-3'>
            <div className='flex items-center justify-between'>
              <Image
                alt='Logo'
                className='w-8'
                radius='none'
                src='/logo.png'
              />

              <SidebarToggler />
            </div>
          </div>
          <div className='flex-1 p-3'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='text-sm font-semibold'>Channels</h4>
              <Button
                isIconOnly
                size='sm'
                variant='light'
              >
                <LucidePlus size={16} />
              </Button>
            </div>
            <ul className='flex flex-col gap-2'>
              {channels.map((channel) => (
                <li key={channel.id}>
                  <Card
                    as={Link}
                    className='group hover:bg-content3 w-full bg-transparent'
                    href={`/app/channels/${channel.id}`}
                    isPressable
                    shadow='none'
                  >
                    <CardBody className='p-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Avatar />
                          <div className='flex flex-col'>
                            <span className='max-w-40 truncate text-sm font-semibold'>
                              {channel.name}
                            </span>
                            <span className='max-w-40 truncate text-xs text-gray-500'>
                              {channel.lastMessage?.content}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
          <Card className='m-1'>
            <CardBody className='p-2'>
              <div className='flex items-center justify-between'>
                <User
                  description='halilaydin.dev'
                  name='Halil Aydın'
                />
                <div className='flex gap-1'>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                  >
                    <LucideUsers size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                  >
                    <LucideCable size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                  >
                    <LucideSettings size={20} />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </aside>
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
