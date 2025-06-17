import type { Message } from "dactoly.js";

import { create } from "zustand";

interface MessageStore {
  addMessage: (message: Message) => void;

  clearMessages: () => void;
  deleteMessage: (messageId: string) => void;
  getMessagesArray: () => Message[];
  messages: Record<string, Message>;

  updateMessage: (message: Message) => void;
}

const useMessageStore = create<MessageStore>((set, get) => ({
  addMessage: (message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [message.id]: message
      }
    })),

  clearMessages: () => set({ messages: {} }),

  deleteMessage: (messageId) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [messageId]: _, ...rest } = state.messages;
      return { messages: rest };
    }),

  getMessagesArray: () => {
    const messagesObj = get().messages;
    return Object.values(messagesObj).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },

  messages: {},

  updateMessage: (message) =>
    set((state) => {
      if (!state.messages[message.id]) return state; // güncellenecek mesaj yoksa dokunma
      return {
        messages: {
          ...state.messages,
          [message.id]: message
        }
      };
    })
}));

export default useMessageStore;
