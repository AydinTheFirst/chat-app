import type { User } from "dictoly.js";

import { useEffect, useState } from "react";

import { useAuth } from "~/hooks/use-auth";
import { useSocket } from "~/hooks/use-socket";

interface TypingIndicatorProps {
  channelId: string;
}

interface TypingPayload {
  channelId: string;
  user: User;
}

export default function TypingIndicator({ channelId }: TypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const { socket } = useSocket();
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
    if (!socket) return;

    socket.on("startTyping", (payload: TypingPayload) => {
      if (payload.user.id === currentUser.id) return;

      if (payload.channelId === channelId) {
        addUserTyping(payload.user);
      }
    });

    socket.on("stopTyping", (payload: TypingPayload) => {
      if (payload.user.id === currentUser.id) return;

      if (payload.channelId === channelId) {
        removeUserTyping(payload.user);
      }
    });

    return () => {
      socket.off("startTyping");
      socket.off("stopTyping");
    };
  }, [socket, channelId, currentUser]);

  if (typingUsers.length === 0) {
    return;
  }

  return (
    <div className='animate-appearance-in absolute bottom-0 bg-gray-100 p-2 text-sm text-gray-500'>
      {typingUsers.map((u) => u.profile?.displayName).join(", ")} typing...
    </div>
  );
}
