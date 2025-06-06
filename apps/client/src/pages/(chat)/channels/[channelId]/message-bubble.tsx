import type { Message } from "dictoly.js";

import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure
} from "@heroui/react";
import {
  LucideChevronDown,
  LucideCopy,
  LucideEdit,
  LucideTrash
} from "lucide-react";
import { toast } from "sonner";

import CdnAvatar from "~/components/cdn-avatar";
import ConfirmModal from "~/components/confirm-modal";
import { MarkdownRenderer } from "~/components/markdown-renderer";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";

import EditMessage from "./edit-message";

interface EditMessageProps {
  message: Message;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuth();
  const fromUser = message.authorId === user.id;

  return (
    <div
      className={cn(
        "group animate-appearance-in flex gap-3",
        fromUser ? "justify-end" : "justify-start"
      )}
    >
      {!fromUser && (
        <CdnAvatar
          name={message.author?.username}
          src={message.author?.profile?.avatarUrl ?? undefined}
        />
      )}

      {fromUser && (
        <div className={cn("opacity-0 group-hover:opacity-100")}>
          <MessageActions message={message} />
        </div>
      )}

      <div className='flex flex-col gap-1'>
        {!fromUser && (
          <span className='text-sm font-semibold text-gray-900 dark:text-white'>
            {message.author?.username}
          </span>
        )}

        <div
          className={cn(
            "flex flex-col gap-3 p-3 leading-relaxed",
            fromUser
              ? "rounded-s-xl rounded-ee-xl bg-blue-100 dark:bg-blue-700" // sağ baloncuk farklı renk ve köşe
              : "rounded-e-xl rounded-es-xl bg-sky-100 dark:bg-sky-700"
          )}
        >
          <MessageContent content={message.content} />
        </div>
        <span className='text-end text-xs text-gray-500 dark:text-gray-400'>
          {message.editedAt ? (
            <span>
              {new Date(message.editedAt).toLocaleString()}
              <small className='ml-2'>(Edited)</small>
            </span>
          ) : (
            <span>{new Date(message.createdAt).toLocaleString()}</span>
          )}
        </span>
      </div>
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    toast.success("Message copied to clipboard.");
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
            <LucideChevronDown className='h-4 w-4' />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label='Message Actions'>
          <DropdownItem
            key='copy'
            onPress={handleCopy}
            startContent={<LucideCopy className='h-4 w-4' />}
          >
            Copy
          </DropdownItem>

          <DropdownItem
            key='edit'
            onPress={editModal.onOpen}
            startContent={<LucideEdit className='h-4 w-4' />}
          >
            Edit
          </DropdownItem>

          <DropdownItem
            className='text-danger'
            color='danger'
            key='delete'
            onPress={confirmDeleteModal.onOpen}
            startContent={<LucideTrash className='h-4 w-4' />}
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
        onConfirm={handleDelete}
      />
    </>
  );
}

function MessageContent({ content }: { content: string }) {
  return (
    <div className='prose dark:prose-invert text-sm break-all'>
      <MarkdownRenderer content={content} />
    </div>
  );
}
