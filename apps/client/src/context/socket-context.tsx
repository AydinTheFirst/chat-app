import React, { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

import { API_URL } from "~/config";

interface SocketContextType {
  socket: Socket;
}

export const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(API_URL, {
      auth: { token: localStorage.getItem("token") }
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("authSuccess", () => {
      newSocket.emit("updateStatus", { status: "online" });
    });

    newSocket.on("error", (error: string) => {
      toast.error(`Socket error: ${error}`);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket) return;

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
