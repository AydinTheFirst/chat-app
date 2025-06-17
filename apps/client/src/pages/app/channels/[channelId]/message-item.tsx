import type { Message } from "dactoly.js";

import { Avatar } from "@heroui/react";
import { memo } from "react";
import snarkdown from "snarkdown";

import MessageTime from "~/components/message-time";

interface Props {
  message: Message;
}

function MessageItem({ message }: Props) {
  return (
    <div className='flex items-start gap-2.5'>
      <Avatar size='sm' />
      <div className='flex w-full flex-col leading-1.5'>
        <div className='flex items-center space-x-1'>
          <span className='text-sm font-semibold text-gray-900 dark:text-white'>
            {message.author?.profile?.displayName}
          </span>
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            <MessageTime createdAt={message.createdAt} />
          </span>
        </div>
        <span className='py-1 text-sm text-gray-900 dark:text-white'>
          <div className='prose dark:prose-invert prose-sm'>
            <span
              dangerouslySetInnerHTML={{
                __html: snarkdown(message.content)
              }}
            />
          </div>
        </span>
      </div>
    </div>
  );
}

export default memo(MessageItem);
