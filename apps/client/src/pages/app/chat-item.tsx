import type { Channel } from "dactoly.js";

import { Card, CardBody, cn } from "@heroui/react";
import { Link, useLocation } from "react-router";

import CdnAvatar from "~/components/cdn-avatar";
import { useAuth } from "~/hooks/use-auth";
import useChannelInfo from "~/hooks/use-channel-info";

interface ChatItemProps {
  channel: Channel;
}

export default function ChatItem({ channel }: ChatItemProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const channelInfo = useChannelInfo({ channel, user });

  const href = `/app/channels/${channel.id}`;
  const isActive = pathname === href;

  return (
    <Card
      as={Link}
      className={cn(
        "group hover:bg-content3 w-full bg-transparent",
        isActive ? "bg-content3" : "bg-transparent"
      )}
      isPressable
      shadow='none'
      to={href}
    >
      <CardBody className='p-2'>
        <div className='flex items-center gap-2'>
          <CdnAvatar
            color='primary'
            name={channelInfo.displayName}
            {...(channelInfo.avatarUrl && { src: channelInfo.avatarUrl })}
          />
          <div className='flex flex-col'>
            <span className='max-w-40 truncate text-sm font-semibold'>
              {channelInfo.displayName}
            </span>
            <span className='max-w-40 truncate text-xs text-gray-500'>
              {channel.lastMessage?.content}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
