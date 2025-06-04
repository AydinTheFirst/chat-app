import type { Channel } from "server-types";

import { Avatar, Card, CardBody, cn, Link } from "@heroui/react";
import { useLocation } from "react-router";

interface ChatBoxProps {
  channel: Channel;
}

export default function ChatBox(props: ChatBoxProps) {
  const { channel } = props;

  const { pathname } = useLocation();

  const isActive = pathname === `/channels/${channel.id}`;

  return (
    <Card
      as={Link}
      className={cn(isActive && "bg-[#2E2F2F]")}
      href={`/channels/${channel.id}`}
      isHoverable
      isPressable
      shadow='none'
    >
      <CardBody className='grid grid-cols-12 gap-3'>
        <div className='col-span-2'>
          <Avatar
            alt={channel.name}
            className='h-12 w-12'
            name={channel.name}
            src={`https://api.dicebear.com/9.x/bottts/svg?seed=${channel.name}`}
          />
        </div>
        <div className='col-span-8'>
          <h3 className='text-lg font-semibold'>{channel.name}</h3>
          <p className='truncate text-sm text-gray-500'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
            ducimus quos totam deleniti laborum excepturi doloribus delectus
            tenetur magni qui modi, esse error quo recusandae ex minus
            reprehenderit rerum vel.
          </p>
        </div>
        <div className='col-span-2'>
          <p className='flex justify-end text-xs text-gray-500'>now</p>
        </div>
      </CardBody>
    </Card>
  );
}
