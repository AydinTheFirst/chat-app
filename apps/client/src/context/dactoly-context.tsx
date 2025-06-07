import type { DactolyClient } from "dactoly.js";

import React from "react";

import { dactoly } from "~/lib/dactoly";

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

    client.ws.connect();

    client.ws.onAny((event: string, ...args: unknown[]) => {
      console.log(`WebSocket event: ${event}`, ...args);
    });

    client.ws.on("authSuccess", () => {
      client.ws.emit("updateStatus", "online");
    });

    return () => {
      client.ws.off("authSuccess");
      client.ws.offAny();
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
