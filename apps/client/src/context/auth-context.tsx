import type { User } from "server-types";

import React, { createContext, useEffect, useState } from "react";
import useSWR from "swr";

interface AuthContextType {
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<undefined | User>>;
  user?: User;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const { data: me } = useSWR<User>("/auth/@me");

  useEffect(() => {
    if (!me) return;
    setUser(me);
  }, [me]);

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ logout, setUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};
