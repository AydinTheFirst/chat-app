import type { Channel } from "dictoly.js";

import { Avatar, Card, CardBody, Link } from "@heroui/react";
import { useLocation } from "react-router";

interface ChatBoxProps {
  channel: Channel;
}

export default function ChatBox(props: ChatBoxProps) {
  const { channel } = props;

  const { pathname } = useLocation();

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
          <Avatar className='flex-shrink-0' />
          <div className='flex min-w-0 flex-col'>
            <span className='truncate'>{channel.name}</span>
            <p className='truncate text-sm text-gray-500'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
              facilis reprehenderit dolore aspernatur odio reiciendis,
              doloremque explicabo excepturi qui esse eum cupiditate alias
              perferendis quos doloribus optio velit ducimus harum?
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
