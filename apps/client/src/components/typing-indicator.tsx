import type { User } from "dactoly.js";

import { useEffect } from "react";
import { create } from "zustand";

import { useAuth } from "~/hooks/use-auth";
import { useDactoly } from "~/hooks/use-dactoly";

interface TypingIndicatorProps {
  channelId: string;
}

interface TypingPayload {
  channelId: string;
  user: User;
}

interface TypingStore {
  addUserTyping: (user: User) => void;
  removeUserTyping: (user: User) => void;
  typingUsers: Record<string, User>;
}

const useTypingStore = create<TypingStore>((set) => ({
  addUserTyping: (user) =>
    set((state) => {
      if (state.typingUsers[user.id]) return state; // User already typing
      return { typingUsers: { ...state.typingUsers, [user.id]: user } };
    }),
  removeUserTyping: (user) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [user.id]: _, ...rest } = state.typingUsers;
      return { typingUsers: rest };
    }),
  typingUsers: {}
}));

export default function TypingIndicator({ channelId }: TypingIndicatorProps) {
  const { dactoly } = useDactoly();
  const { user: currentUser } = useAuth();

  const { addUserTyping, removeUserTyping, typingUsers } = useTypingStore();

  useEffect(() => {
    dactoly.ws.on("startTyping", (payload: TypingPayload) => {
      if (payload.user.id === currentUser.id) return;

      if (payload.channelId === channelId) {
        addUserTyping(payload.user);
      }
    });

    dactoly.ws.on("stopTyping", (payload: TypingPayload) => {
      if (payload.user.id === currentUser.id) return;

      if (payload.channelId === channelId) {
        removeUserTyping(payload.user);
      }
    });

    return () => {
      dactoly.ws.off("startTyping");
      dactoly.ws.off("stopTyping");
    };
  }, [dactoly, channelId, currentUser, addUserTyping, removeUserTyping]);

  const typingUsersArray = Object.values(typingUsers);

  if (typingUsersArray.length === 0) return <div className='h-4' />;

  return (
    <div className='flex'>
      <p className='text-xs'>
        {typingUsersArray.map((u) => u.profile?.displayName).join(", ")} is
        typing...
      </p>
    </div>
  );
}
