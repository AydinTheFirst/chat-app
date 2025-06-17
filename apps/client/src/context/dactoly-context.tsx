import type { Client } from "dactoly.js";

import React from "react";

import dactoly from "~/lib/dactoly";

interface DactolyContextType {
  dactoly: Client;
}

export const DactolyContext = React.createContext<
  DactolyContextType | undefined
>(undefined);

export const DactolyProvider = ({ children }: React.PropsWithChildren) => {
  const dactolyClient = React.useRef(dactoly);

  React.useEffect(() => {
    if (!dactolyClient.current) return;

    const socket = dactolyClient.current.ws;

    socket.on("authSuccess", () => {
      console.log("WebSocket authentication successful");
    });

    socket.onAny((event, ...args) => {
      console.log(`WebSocket event: ${event}`, args);
    });

    socket.onAnyOutgoing((event, ...args) => {
      console.log(`WebSocket outgoing event: ${event}`, args);
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <DactolyContext.Provider value={{ dactoly: dactolyClient.current }}>
      {children}
    </DactolyContext.Provider>
  );
};
