import type { User } from "dictoly.js";

import { useEffect, useState } from "react";

import { useAuth } from "~/hooks/use-auth";
import { useDictoly } from "~/hooks/use-dictoly";

interface TypingIndicatorProps {
  channelId: string;
}

interface TypingPayload {
  channelId: string;
  user: User;
}

export default function TypingIndicator({ channelId }: TypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const { dictolyClient } = useDictoly();
  const { user: currentUser } = useAuth();

  const addUserTyping = (user: User) => {
    setTypingUsers((prev) => {
      if (prev.some((u) => u.id === user.id)) return prev;
      return [...prev, user];
    });
  };

  const removeUserTyping = (user: User) => {
    setTypingUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  useEffect(() => {
    dictolyClient.ws.on("startTyping", (payload: TypingPayload) => {
      if (payload.user.id === currentUser.id) return;

      if (payload.channelId === channelId) {
        addUserTyping(payload.user);
      }
    });

    dictolyClient.ws.on("stopTyping", (payload: TypingPayload) => {
      if (payload.user.id === currentUser.id) return;

      if (payload.channelId === channelId) {
        removeUserTyping(payload.user);
      }
    });

    return () => {
      dictolyClient.ws.off("startTyping");
      dictolyClient.ws.off("stopTyping");
    };
  }, [dictolyClient, channelId, currentUser]);

  if (typingUsers.length === 0) {
    return;
  }

  return (
    <div className='animate-appearance-in absolute bottom-0 bg-gray-100 p-2 text-sm text-gray-500'>
      {typingUsers.map((u) => u.profile?.displayName).join(", ")} typing...
    </div>
  );
}
