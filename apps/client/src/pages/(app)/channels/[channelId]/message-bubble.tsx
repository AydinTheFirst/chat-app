import type { Message } from "dactoly.js";
import type { PropsWithChildren } from "react";

import { Button, useDisclosure } from "@heroui/react";
import { cn } from "@heroui/react"; // <--- cn fonksiyonu burada
import * as ContextMenu from "@radix-ui/react-context-menu";
import { toast } from "sonner";

import CdnAvatar from "~/components/cdn-avatar";
import ConfirmModal from "~/components/confirm-modal";
import MessageContent from "~/components/message-content";
import UserContextMenu from "~/components/user-context-menu";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";

import MessageTime from "../../../../components/message-time";
import EditMessage from "./edit-message";

interface EditMessageProps extends PropsWithChildren {
  message: Message;
}

interface MessageBubbleProps {
  message: Message;
  prevMessage?: Message;
}

export default function MessageBubble({
  message,
  prevMessage
}: MessageBubbleProps) {
  const isSystem = message.type === "SYSTEM";

  if (isSystem) {
    return (
      <div className='my-2 flex justify-center'>
        <span className='text-sm text-gray-500 italic dark:text-gray-400'>
          <MessageContent content={message.content} />
        </span>
      </div>
    );
  }

  const isSameAuthor =
    prevMessage &&
    prevMessage?.author?.id === message.author?.id &&
    new Date(message.createdAt).getTime() -
      new Date(prevMessage.createdAt).getTime() <
      5 * 60 * 1000;

  if (message.deletedAt) {
    return null;
  }

  return (
    <div
      className={cn("group flex items-start gap-3", !isSameAuthor && "mt-4")}
    >
      {!isSameAuthor ? (
        <UserContextMenu user={message.author!}>
          <CdnAvatar
            {...(message.author?.profile?.avatarUrl && {
              src: message.author.profile.avatarUrl
            })}
            name={message.author?.profile?.displayName || "Unknown User"}
          />
        </UserContextMenu>
      ) : (
        <div className='w-10'></div>
      )}

      <div className='flex w-full flex-col leading-1.5'>
        {!isSameAuthor && (
          <div className='flex items-center space-x-2 rtl:space-x-reverse'>
            <span className='text-sm font-semibold text-gray-900 dark:text-white'>
              {message.author?.profile?.displayName || "Unknown User"}
            </span>
            <span className='text-xs font-normal text-gray-500 dark:text-gray-400'>
              <MessageTime createdAt={message.createdAt} />
            </span>
          </div>
        )}

        <MessageActions message={message}>
          <span className='max-w-7xl text-sm font-normal text-gray-900 dark:text-white'>
            <MessageContent content={message.content} />
          </span>
        </MessageActions>

        {message.editedAt && (
          <span className='mt-2 text-xs font-normal text-gray-500 dark:text-gray-400'>
            <MessageTime createdAt={message.editedAt} /> (Edited)
          </span>
        )}
      </div>
    </div>
  );
}

function MessageActions({ children, message }: EditMessageProps) {
  const editModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      await http.delete(`/messages/${message.id}`);
      toast.success("Message deleted successfully.");
    } catch (error) {
      handleError(error);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    toast.success("Message copied to clipboard.");
  };

  const isAuthor = user?.id === message.author?.id;

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger className='cursor-pointer'>
          {children}
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className='roumin-w-xl bg-content2 grid min-w-40 gap-1 rounded p-1'>
            <ContextMenu.Item asChild>
              <Button
                className='justify-start'
                onPress={handleCopy}
                size='sm'
                variant='light'
              >
                Copy
              </Button>
            </ContextMenu.Item>

            <ContextMenu.Item
              asChild
              hidden={!isAuthor}
            >
              <Button
                className='justify-start'
                onPress={editModal.onOpen}
                size='sm'
                variant='light'
              >
                Edit
              </Button>
            </ContextMenu.Item>

            <ContextMenu.Item
              asChild
              hidden={!isAuthor}
            >
              <Button
                className='justify-start'
                color='danger'
                onPress={confirmDeleteModal.onOpen}
                size='sm'
                variant='light'
              >
                Delete
              </Button>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>

      <EditMessage
        {...editModal}
        message={message}
      />

      <ConfirmModal
        {...confirmDeleteModal}
        message='Are you sure you want to delete this message?'
        onConfirm={handleDelete}
      />
    </>
  );
}
