import type { User } from "dactoly.js";

// stores/use-users-store.ts
import { create } from "zustand";

interface UserStore {
  getUser: (id: string) => undefined | User;
  setUsers: (users: User[]) => void;
  users: Record<string, User>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  getUser: (id) => get().users[id],
  setUsers: (users) =>
    set({
      users: Object.fromEntries(users.map((u) => [u.id, u]))
    }),
  users: {}
}));
