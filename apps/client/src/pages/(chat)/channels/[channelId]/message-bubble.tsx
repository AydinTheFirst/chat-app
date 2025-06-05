import {
  Avatar,
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure
} from "@heroui/react";
import { LucideMoreVertical } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import type { MessageWithAuthor } from "~/types";

import ConfirmModal from "~/components/confirm-modal";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";

import EditMessage from "./edit-message";

interface EditMessageProps {
  message: MessageWithAuthor;
}

interface MessageBubbleProps {
  message: MessageWithAuthor;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuth();
  const fromUser = message.author.id === user?.id;
  const avatarUrl = `https://api.dicebear.com/9.x/bottts/svg?seed=${message.author.username}`;

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2.5",
        "group relative",
        fromUser ? "justify-end" : "justify-start"
      )}
    >
      {!fromUser && (
        <Avatar
          alt={message.author.username}
          src={avatarUrl}
        />
      )}

      {fromUser && (
        <div
          className={cn(
            "grid h-full place-items-center",
            "opacity-0 transition-all group-hover:opacity-100"
          )}
        >
          <MessageActions message={message} />
        </div>
      )}

      <div
        className={cn(
          "flex max-w-xl flex-col gap-3 p-3 leading-relaxed",
          fromUser
            ? "rounded-s-xl rounded-ee-xl bg-blue-100 dark:bg-blue-700" // sağ baloncuk farklı renk ve köşe
            : "bg-content3 rounded-e-xl rounded-es-xl dark:bg-gray-700"
        )}
      >
        {!fromUser && (
          <span className='text-sm font-semibold text-gray-900 dark:text-white'>
            {message.author.username}
          </span>
        )}
        <Message content={message.content} />
        <span className='text-end text-xs text-gray-500 dark:text-gray-400'>
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function Message({ content }: { content: string }) {
  return (
    <div className='prose dark:prose-invert max-w-full'>
      <ReactMarkdown
        components={{
          a: (props) => (
            <a
              {...props}
              className='underline'
            />
          )
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function MessageActions({ message }: EditMessageProps) {
  const editModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();

  const handleDelete = async () => {
    try {
      await http.delete(`/messages/${message.id}`);
      toast.success("Message deleted successfully.");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size='sm'
            variant='light'
          >
            <LucideMoreVertical className='h-4 w-4' />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label='Message Actions'>
          <DropdownItem
            key='edit'
            onClick={editModal.onOpen}
          >
            Edit
          </DropdownItem>

          <DropdownItem
            className='text-danger'
            color='danger'
            key='delete'
            onClick={confirmDeleteModal.onOpen}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <EditMessage
        {...editModal}
        message={message}
      />

      <ConfirmModal
        {...confirmDeleteModal}
        message='Are you sure you want to delete this message?'
        onYes={handleDelete}
      />
    </>
  );
}
