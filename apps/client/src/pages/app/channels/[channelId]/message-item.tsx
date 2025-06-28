import { cn } from "@heroui/react";
import { type Message, MessageType } from "dactoly.js";
import { memo } from "react";
import snarkdown from "snarkdown";

import CdnAvatar from "~/components/cdn-avatar";
import MessageTime from "~/components/message-time";

interface Props {
  message: Message;
  previousMessage: Message | null;
}

function isCompactWithPrevious(current: Message, previous: Message | null) {
  if (!previous) return false;
  if (current.authorId !== previous.authorId) return false;

  const currTime = new Date(current.createdAt).getTime();
  const prevTime = new Date(previous.createdAt).getTime();

  return currTime - prevTime <= 60_0000;
}

function MessageItem({ message, previousMessage }: Props) {
  const compact = isCompactWithPrevious(message, previousMessage);
  const html = snarkdown(message.content);

  if (message.type === MessageType.SYSTEM) {
    return (
      <div className='flex items-center justify-center py-3 text-sm text-gray-500 dark:text-gray-400'>
        <p dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-2.5", !compact && "mt-4")}>
      {!compact ? (
        <CdnAvatar
          size='sm'
          {...(message.author?.profile?.avatarUrl && {
            src: message.author.profile.avatarUrl
          })}
          name={message.author?.profile?.displayName}
        />
      ) : (
        <div className='w-8' />
      )}
      <div className='flex w-full flex-col leading-1.5'>
        {!compact && (
          <div className='flex items-center gap-1'>
            <span className='text-sm font-semibold text-gray-900 dark:text-white'>
              {message.author?.profile?.displayName}
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              <MessageTime createdAt={message.createdAt} />
            </span>
          </div>
        )}

        <div className='prose dark:prose-invert prose-sm'>
          <p dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}

export default memo(MessageItem);
