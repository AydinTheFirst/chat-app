import { create } from "zustand";

interface ActiveChannelStore {
  activeChannelId: null | string;
  setActiveChannelId: (id: null | string) => void;
}

export const useActiveChannelStore = create<ActiveChannelStore>((set) => ({
  activeChannelId: null,
  setActiveChannelId: (id) => set({ activeChannelId: id })
}));
