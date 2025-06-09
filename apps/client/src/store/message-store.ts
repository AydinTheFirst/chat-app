import { Message, plainToInstance } from "dactoly.js";
import { create } from "zustand";

interface MessageStore {
  addMessage: (channelId: string, message: Message) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
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
