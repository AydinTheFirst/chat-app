import type { KeyboardEvent } from "react";

import { Button, Card, CardBody, Textarea } from "@heroui/react";
import { LucideSend, LucideSticker } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import EmojiPicker from "~/components/emoji-picker";
import { useTyping } from "~/hooks/use-typing";
import { handleError, http } from "~/lib/http";
import { useChannelStore } from "~/store/channel-store";

export default function MessageInput() {
  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { channelId } = useParams<{ channelId: string }>();
  const channel = useChannelStore((s) => s.channels[channelId!]);

  const { setTyping } = useTyping(channelId!);

  useEffect(() => {
    setTyping(message.length > 0);
  }, [message, setTyping]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("content", message);
    formData.append("channelId", channel.id);

    const data = Object.fromEntries(formData.entries());

    try {
      await http.post("/messages", data);
      setMessage("");
    } catch (error) {
      handleError(error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      form?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };

  return (
    <div className='relative'>
      {showEmojiPicker && (
        <div className='absolute bottom-20 left-4 z-10'>
          <EmojiPicker
            onSelect={(emoji) => setMessage((prev) => prev + emoji)}
          />
        </div>
      )}
      <Card
        className='bg-content1'
        radius='none'
      >
        <CardBody>
          <form
            className='flex items-center gap-1'
            onSubmit={handleSubmit}
          >
            <Button
              isIconOnly
              onPress={() => setShowEmojiPicker((prev) => !prev)}
              variant='light'
            >
              <LucideSticker />
            </Button>
            <Textarea
              fullWidth
              minRows={1}
              name='content'
              onKeyDown={handleKeyDown}
              onValueChange={setMessage}
              placeholder='Type your message...'
              value={message}
              variant='bordered'
            />
            <Button
              hidden={message.length === 0}
              isIconOnly
              size='sm'
              type='submit'
              variant='light'
            >
              <LucideSend size={20} />
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
