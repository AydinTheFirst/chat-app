import React from "react";

import { DictolyContext } from "~/context/dictoly-context";

export function useDictoly() {
  const ctx = React.useContext(DictolyContext);

  if (!ctx) {
    throw new Error("useDictoly must be used within a DictolyProvider");
  }

  return ctx;
}
