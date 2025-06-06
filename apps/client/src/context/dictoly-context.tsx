import type { DictolyClient } from "dictoly.js";

import React from "react";

import { dictoly } from "~/lib/dictoly";

interface DictolyContextType {
  dictolyClient: DictolyClient;
}

export const DictolyContext = React.createContext<DictolyContextType | null>(
  null
);

export const DictolyProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [dictolyClient, setDictolyClient] = React.useState<DictolyClient>();

  React.useEffect(() => {
    setDictolyClient(dictoly);
  }, [dictolyClient]);

  if (!dictolyClient) return;

  return (
    <DictolyContext.Provider value={{ dictolyClient }}>
      {children}
    </DictolyContext.Provider>
  );
};
