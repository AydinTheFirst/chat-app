import { Card, CardBody, Link } from "@heroui/react";
import { useLocation } from "react-router";

import CdnAvatar from "~/components/cdn-avatar";
import { useAuth } from "~/hooks/use-auth";
import { getChannelDisplayInfo } from "~/lib/utils";

import type { Channel } from "dactoly.js";

interface ChatBoxProps {
  channel: Channel;
}

export default function ChatBox(props: ChatBoxProps) {
  const { channel } = props;
  const { user: currentUser } = useAuth();

  const { pathname } = useLocation();

  const channelInfo = getChannelDisplayInfo(channel, currentUser.id);

  return (
    <Card
      as={Link}
      href={`/channels/${channel.id}`}
      isDisabled={pathname === `/channels/${channel.id}`}
      isHoverable
      isPressable
    >
      <CardBody>
        <div className='flex items-center gap-3'>
          <CdnAvatar
            className='flex-shrink-0'
            name={channelInfo.displayName}
            {...(channelInfo.icon && { src: channelInfo.icon })}
          />
          <div className='flex min-w-0 flex-col'>
            <span className='truncate'>{channelInfo.displayName}</span>
            <p className='truncate text-sm text-gray-500'>
              {channel.lastMessage
                ? channel.lastMessage.content
                : "No messages yet. Start the conversation!"}
            </p>
            <div className='m-1' />
            <span className='text-end text-xs text-gray-500'>
              {new Date(channel.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
