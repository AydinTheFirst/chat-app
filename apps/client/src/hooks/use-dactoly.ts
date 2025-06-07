import React from "react";

import { DactolyContext } from "~/context/dactoly-context";

export function useDactoly() {
  const ctx = React.useContext(DactolyContext);

  if (!ctx) {
    throw new Error("useDactoly must be used within a DactolyProvider");
  }

  return ctx;
}
