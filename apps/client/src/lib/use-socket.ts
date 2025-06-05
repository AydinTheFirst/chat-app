import type { Socket } from "socket.io-client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { API_URL } from "~/config";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(API_URL, {
      auth: {
        token: localStorage.getItem("token")
      }
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};
