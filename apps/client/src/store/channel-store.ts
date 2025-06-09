import { Channel, plainToInstance } from "dactoly.js";
import { create } from "zustand";

interface ChannelStore {
  addChannel: (channel: Channel) => void;
  channels: Record<string, Channel>;
  deleteChannel: (channelId: string) => void;
  setChannels: (channels: Channel[]) => void;
  updateChannel: (channelId: string, updatedData: Partial<Channel>) => void;
}

export const useChannelStore = create<ChannelStore>((set) => ({
  addChannel: (channel) =>
    set((state) => ({
      channels: {
        ...state.channels,
        [channel.id]: plainToInstance(Channel, channel)
      }
    })),

  channels: {},

  deleteChannel: (channelId) =>
    set((state) => {
      const newChannels = { ...state.channels };
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete newChannels[channelId];
      return {
        channels: newChannels
      };
    }),

  setChannels: (channels) =>
    set(() => ({
      channels: Object.fromEntries(channels.map((c) => [c.id, c]))
    })),

  updateChannel: (channelId, updatedData) =>
    set((state) => {
      const channel = state.channels[channelId];
      if (!channel) return {};
      const updatedChannel = plainToInstance(Channel, {
        ...channel,
        ...updatedData
      });
      return {
        channels: {
          ...state.channels,
          [channelId]: updatedChannel
        }
      };
    })
}));
