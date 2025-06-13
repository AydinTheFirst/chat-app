import type { DactolyClient } from "dactoly.js";

import React from "react";

import { dactoly } from "~/lib/dactoly";
import { initSocketEvents } from "~/lib/ws-handler";

interface DactolyContextType {
  dactolyClient: DactolyClient;
}

export const DactolyContext = React.createContext<DactolyContextType | null>(
  null
);

export const DactolyProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const dactolyClientRef = React.useRef<DactolyClient>(dactoly);

  React.useEffect(() => {
    const client = dactolyClientRef.current;
    const socket = client.ws;

    socket.connect();

    socket.on("connect", () => {
      initSocketEvents();
    });

    socket.on("authSuccess", () => {
      socket.emit("updateStatus", "online");
    });

    return () => {
      socket.off("authSuccess");
      socket.offAny();
      socket.disconnect();
    };
  }, []);

  return (
    <DactolyContext.Provider
      value={{ dactolyClient: dactolyClientRef.current }}
    >
      {children}
    </DactolyContext.Provider>
  );
};
