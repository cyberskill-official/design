import React from "react";

// DOM work must run before paint in a browser, but cannot run during SSR.
// Selecting the effect at module load preserves hook order within each runtime.
export const useClientLayoutEffect = typeof document === "undefined"
  ? React.useEffect
  : React.useLayoutEffect;
