import { Message, plainToInstance } from "dactoly.js";
import { create } from "zustand";

import { dactoly } from "~/lib/dactoly";

interface MessageStore {
  addMessage: (channelId: string, message: Message) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  fetchMessages: (channelId: string) => Promise<Message[]>;
  messages: Record<string, Message[]>;
  setMessages: (channelId: string, messages: Message[]) => void;
  updateMessage: (channelId: string, updatedMessage: Message) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  addMessage: (channelId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [
          ...(state.messages[channelId] || []),
          plainToInstance(Message, message)
        ]
      }
    })),

  deleteMessage: (channelId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] || []).filter(
          (m) => m.id !== messageId
        )
      }
    })),

  fetchMessages: async (channelId) => {
    try {
      const messages = await dactoly.messages.getAll({ channelId, limit: 100 });
      const messageInstances = messages.data.map((m) =>
        plainToInstance(Message, m)
      );

      set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: messageInstances
        }
      }));
      return messageInstances;
    } catch (error) {
      console.error("Failed to fetch messages for channel:", channelId, error);
      return [];
    }
  },

  messages: {},

  setMessages: (channelId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: messages.map((m) => plainToInstance(Message, m))
      }
    })),

  updateMessage: (channelId, updatedMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] || []).map((m) =>
          m.id === updatedMessage.id
            ? plainToInstance(Message, updatedMessage)
            : m
        )
      }
    }))
}));
