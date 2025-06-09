import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link
} from "@heroui/react";
import { LucideEllipsisVertical, LucideUser } from "lucide-react";

import ToggleTheme from "~/components/toggle-theme";
import UserCard from "~/components/user-card";
import { useAuth } from "~/hooks/use-auth";
import { useChannelStore } from "~/store/channel-store";

import SidebarToggler from "../../components/sidebar-toggler";
import ChatBox from "../chat-box";
import CreateChannel from "../create-channel";

export default function Sidebar() {
  const { user: currentUser } = useAuth();

  const channels = Object.values(useChannelStore((s) => s.channels));

  const filteredChannels = channels.filter(() => true);

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
              <Image
                alt='Dactoly Logo'
                className='h-10 w-10'
                radius='none'
                src='/logo.png'
              />
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
              channelId={channel.id}
              key={i}
            />
          ))}
        </div>
        {filteredChannels.length === 0 && (
          <div className='text-center text-gray-500'>
            No channel found. Create a new channel to start chatting!
          </div>
        )}
      </CardBody>
      <Divider />
      <CardFooter>
        {currentUser && (
          <div className='flex w-full items-center justify-between gap-3'>
            <UserCard
              className='m-0'
              user={currentUser}
            />
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
