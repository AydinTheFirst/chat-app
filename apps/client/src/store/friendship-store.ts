import type { Friendship } from "dactoly.js";

import { create } from "zustand";

interface FriendshipStore {
  addFriendship: (friendship: Friendship) => void;
  deleteFriendship: (friendshipId: string) => void;
  friendships: Record<string, Friendship>;
  setFriendships: (friendships: Friendship[]) => void;
  updateFriendship: (friendshipId: string, data: Partial<Friendship>) => void;
}

export const useFriendshipStore = create<FriendshipStore>((set) => ({
  addFriendship: (friendship) =>
    set((state) => ({
      friendships: {
        ...state.friendships,
        [friendship.id]: friendship
      }
    })),

  deleteFriendship: (friendshipId) =>
    set((state) => {
      const newFriendships = { ...state.friendships };
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete newFriendships[friendshipId];
      return {
        friendships: newFriendships
      };
    }),

  friendships: {},

  setFriendships: (friendships) =>
    set(() => ({
      friendships: Object.fromEntries(friendships.map((f) => [f.id, f]))
    })),

  updateFriendship: (friendshipId, data) =>
    set((state) => {
      const friendship = state.friendships[friendshipId];
      if (!friendship) return {};
      const updatedFriendship = { ...friendship, ...data };
      return {
        ...state,
        friendships: {
          ...state.friendships,
          [friendshipId]: updatedFriendship
        }
      };
    })
}));
