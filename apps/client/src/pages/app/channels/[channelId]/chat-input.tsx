import { Button, Textarea } from "@heroui/react";
import {
  LucideGift,
  LucidePlus,
  LucideSmile,
  LucideSticker
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

import TypingIndicator from "~/components/typing-indicator";
import dactoly from "~/lib/dactoly";

interface ChatInputProps {
  channelId: string;
}

export default function ChatInput({ channelId }: ChatInputProps) {
  const [message, setMessage] = React.useState("");

  const handleSubmit = async () => {
    try {
      await dactoly.messages.create({
        channelId,
        content: message
      });

      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Failed to send message:", error);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (message.trim()) {
        handleSubmit();
      }
    }
  };

  return (
    <div className='container'>
      <div className='bg-content3 mb-2 flex items-center gap-3 rounded-lg px-2'>
        <Button
          isIconOnly
          onPress={() => toast.info("This feature is not implemented yet.")}
          size='sm'
          variant='light'
        >
          <LucidePlus size={20} />
        </Button>
        <Textarea
          autoFocus
          minRows={1}
          onKeyDown={onKeyDown}
          onValueChange={setMessage}
          placeholder='Type your message here...'
          radius='none'
          value={message}
        />
        <Button
          isIconOnly
          onPress={() => toast.info("This feature is not implemented yet.")}
          size='sm'
          variant='light'
        >
          <LucideSmile size={20} />
        </Button>
        <Button
          isIconOnly
          onPress={() => toast.info("This feature is not implemented yet.")}
          size='sm'
          variant='light'
        >
          <LucideSticker size={20} />
        </Button>
        <Button
          isIconOnly
          onPress={() => toast.info("This feature is not implemented yet.")}
          size='sm'
          variant='light'
        >
          <LucideGift size={20} />
        </Button>
      </div>
      <TypingIndicator channelId={channelId} />
    </div>
  );
}
