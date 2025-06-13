import type { ReadStatus } from "dactoly.js";

import { create } from "zustand";

import { dactoly } from "~/lib/dactoly";

interface ReadStatusStore {
  fetchStatus: (channelId: string) => Promise<ReadStatus | undefined>;
  fetchUnreadCount: (channelId: string) => Promise<number>;
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

  fetchUnreadCount: async (channelId) => {
    try {
      const count = await dactoly.readStatus.getUnreadCount(channelId);
      return count;
    } catch (error) {
      console.error(
        "Failed to fetch unread count for channel:",
        channelId,
        error
      );
      return 0;
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
