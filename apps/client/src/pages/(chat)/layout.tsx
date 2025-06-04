import type { Channel } from "server-types";

import { Button, Chip, Input } from "@heroui/react";
import { LucideEllipsisVertical, LucideSearch, LucideUser } from "lucide-react";
import { Outlet, useLoaderData } from "react-router";

import type { PaginatedResponse } from "~/types";

import ToggleTheme from "~/components/toggle-theme";
import { http } from "~/lib/http";

import ChatBox from "../chat-box";
import CreateChannel from "../create-channel";

export const clientLoader = async () => {
  const { data: channels } =
    await http.get<PaginatedResponse<Channel>>("/channels");

  return { channels };
};

export default function Layout() {
  const { channels } = useLoaderData<typeof clientLoader>();

  return (
    <div className='grid h-screen grid-cols-12'>
      <div className='thin-border col-span-12 border-e md:col-span-3'>
        <div className='flex h-screen flex-col gap-3 py-4'>
          <div className='container grid grid-cols-1 md:grid-cols-2'>
            <div>
              <h1 className='text-3xl font-bold'>ChatApp</h1>
            </div>
            <div className='flex items-center justify-end gap-1'>
              <CreateChannel />
              <ToggleTheme />
              <Button
                isIconOnly
                variant='light'
              >
                <LucideUser />
              </Button>
              <Button
                isIconOnly
                variant='light'
              >
                <LucideEllipsisVertical />
              </Button>
            </div>
          </div>
          <div className='container'>
            <Input
              placeholder='Search for channels'
              startContent={<LucideSearch className='h-5 w-5' />}
              variant='faded'
            />
          </div>
          <div className='container flex gap-1'>
            <Chip color='primary'>All</Chip>
            <Chip>Unread</Chip>
            <Chip>Favorites</Chip>
            <Chip>Secret</Chip>
          </div>
          <div className='container flex-1 overflow-y-auto py-5'>
            <div className='grid gap-2'>
              {channels.data.map((channel, i) => (
                <ChatBox
                  channel={channel}
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='col-span-12 md:col-span-9'>
        <Outlet />
      </div>
    </div>
  );
}
