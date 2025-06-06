import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Input,
  Link
} from "@heroui/react";
import { Channel, plainToInstance } from "dictoly.js";
import { LucideEllipsisVertical, LucideSearch, LucideUser } from "lucide-react";
import React from "react";
import { useLoaderData } from "react-router";

import ToggleTheme from "~/components/toggle-theme";
import UserCard from "~/components/user-card";
import { useAuth } from "~/hooks/use-auth";

import type { clientLoader } from "./layout";

import ChatBox from "../chat-box";
import CreateChannel from "../create-channel";
import SidebarToggler from "./sidebar-toggler";

export default function Sidebar() {
  const { channels } = useLoaderData<typeof clientLoader>();
  const [searchTerm, setSearchTerm] = React.useState("");
  const { user: currentUser } = useAuth();

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card
      className='h-screen'
      radius='none'
    >
      <CardHeader className='flex flex-col items-start gap-3'>
        <div className='grid w-full grid-cols-1 gap-3 md:grid-cols-2'>
          <div className='flex justify-between'>
            <Link
              className='text-3xl font-bold'
              color='foreground'
              href='/'
            >
              ChatApp
            </Link>
            <SidebarToggler className='md:hidden' />
          </div>
          <div className='flex items-center justify-end gap-1'>
            <CreateChannel />
            <Button
              as={Link}
              href='/friends'
              isIconOnly
              variant='light'
            >
              <LucideUser />
            </Button>
          </div>
        </div>

        <Input
          fullWidth
          onValueChange={setSearchTerm}
          placeholder='Search for channels'
          startContent={<LucideSearch className='h-5 w-5' />}
          variant='faded'
        />

        <div className='flex gap-1'>
          <Chip color='primary'>All</Chip>
          <Chip>Unread</Chip>
          <Chip>Favorites</Chip>
          <Chip>Secret</Chip>
        </div>
      </CardHeader>

      <CardBody>
        <h2 className='mb-3 text-xl font-bold'>
          Channels
          <small className='ml-2 text-gray-500'>
            ({filteredChannels.length}/{channels.length})
          </small>
        </h2>
        <div className='grid gap-3'>
          {filteredChannels.map((channel, i) => (
            <ChatBox
              channel={plainToInstance(Channel, channel)}
              key={i}
            />
          ))}
        </div>
        {filteredChannels.length === 0 && (
          <div className='text-center text-gray-500'>
            No channels found. Create a new channel to start chatting!
          </div>
        )}
      </CardBody>
      <Divider />
      <CardFooter>
        {currentUser && (
          <div className='flex w-full items-center justify-between gap-3'>
            <UserCard user={currentUser} />
            <div className='flex items-center gap-2'>
              <ToggleTheme />
              <Button
                isIconOnly
                variant='light'
              >
                <LucideEllipsisVertical />
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
