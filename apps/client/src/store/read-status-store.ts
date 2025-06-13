import type { ReadStatus } from "dactoly.js";

import { create } from "zustand";

import { dactoly } from "~/lib/dactoly";

interface ReadStatusStore {
  fetchStatus: (channelId: string) => Promise<ReadStatus | undefined>;
  readStatus: Record<string, null | ReadStatus>;
  updateStatus: (channelId: string, lastReadMessageId: string) => Promise<void>;
}

export const useReadStatusStore = create<ReadStatusStore>((set) => ({
  fetchStatus: async (channelId) => {
    try {
      const data = await dactoly.readStatus.getStatus(channelId);
      set((state) => ({
        readStatus: {
          ...state.readStatus,
          [channelId]: data
        }
      }));
      return data;
    } catch {
      console.error("Failed to fetch read status for channel:", channelId);
      return undefined;
    }
  },

  readStatus: {},

  updateStatus: async (channelId, lastReadMessageId) => {
    try {
      const data = await dactoly.readStatus.updateStatus({
        channelId,
        lastReadMessageId
      });
      set((state) => ({
        readStatus: {
          ...state.readStatus,
          [channelId]: data
        }
      }));
    } catch (err) {
      console.error("Read status update error:", err);
    }
  }
}));
