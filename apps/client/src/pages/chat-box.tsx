import { Card, CardBody, Chip, cn, Link } from "@heroui/react";
import { useLocation } from "react-router";

import CdnAvatar from "~/components/cdn-avatar";
import { useAuth } from "~/hooks/use-auth";
import { getChannelDisplayInfo } from "~/lib/utils";
import { useChannelStore } from "~/store/channel-store";
import { useLastMessage, useUnreadCount } from "~/store/hooks";

import MessageTime from "../components/message-time";

interface ChatBoxProps {
  channelId: string;
}

export default function ChatBox({ channelId }: ChatBoxProps) {
  const channel = useChannelStore((s) => s.channels[channelId]);
  const { user: currentUser } = useAuth();
  const lastMessage = useLastMessage(channel.id);
  const unreadCount = useUnreadCount(channel.id);

  const { pathname } = useLocation();

  const channelInfo = getChannelDisplayInfo(channel, currentUser.id);

  const isActive = pathname === `/channels/${channel.id}`;

  return (
    <Card
      as={Link}
      className={cn(isActive ? "bg-content2" : "bg-transparent")}
      href={`/channels/${channel.id}`}
      isHoverable
      isPressable
      shadow='none'
    >
      <CardBody>
        <div className='flex items-start gap-2.5'>
          <CdnAvatar
            className='flex-shrink-0'
            name={channelInfo.displayName}
            {...(channelInfo.icon && { src: channelInfo.icon })}
          />
          <div className='flex w-full min-w-0 flex-col gap-1 leading-1.5'>
            <div className='flex items-center justify-between space-x-2 rtl:space-x-reverse'>
              <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                {channelInfo.displayName}
              </span>
              <span className='truncate text-xs font-normal text-gray-500 dark:text-gray-400'>
                {lastMessage && (
                  <MessageTime createdAt={lastMessage.createdAt} />
                )}
              </span>
            </div>
            <div className='flex'>
              <p className='w-full truncate text-xs font-normal text-gray-700 dark:text-gray-300'>
                {lastMessage && lastMessage.content}
              </p>
              {unreadCount > 0 && (
                <Chip
                  color='primary'
                  size='sm'
                >
                  {unreadCount}
                </Chip>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
