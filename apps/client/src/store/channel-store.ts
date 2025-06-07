import { create } from "zustand";

import { Channel, Message, plainToInstance } from "dactoly.js";

interface ChannelStore {
  channels: Record<string, Channel>;
  setChannels: (channels: Channel[]) => void;
  updateLastMessage: (channelId: string, message: Message) => void;
}

export const useChannelStore = create<ChannelStore>((set) => ({
  channels: {},
  setChannels: (channels) =>
    set(() => ({
      channels: Object.fromEntries(channels.map((c) => [c.id, c]))
    })),
  updateLastMessage: (channelId, message) =>
    set((state) => {
      const channel = state.channels[channelId];
      if (!channel) return {};

      const updatedChannel = plainToInstance(Channel, {
        ...channel,
        lastMessage: plainToInstance(Message, message)
      });

      return {
        ...state,
        channels: {
          ...state.channels,
          [channelId]: updatedChannel
        }
      };
    })
}));
