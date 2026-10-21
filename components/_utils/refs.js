import React from "react";

function assignRef(ref, node) {
  if (typeof ref === "function") return ref(node);
  if (ref && typeof ref === "object" && "current" in ref) { ref.current = node; return; }
  throw new TypeError("A native ref must be a callback or an object with current");
}

/** Compose native refs without replacing internal ownership. Stable refs keep one callback.
 * React 19 callback cleanups are preserved; React 18 receives its normal null detach. */
export function useComposedRefs(...refs) {
  return React.useMemo(() => {
    const unique = [...new Set(refs.filter(ref => ref != null))];
    if (!unique.length) return undefined;
    const cleanupSupported = Number.parseInt(React.version, 10) >= 19;
    return node => {
      if (node == null) { unique.forEach(ref => assignRef(ref, null)); return; }
      const cleanups = unique.map(ref => assignRef(ref, node));
      if (!cleanupSupported) return;
      return () => {
        let failure;
        unique.forEach((ref, index) => {
          try {
            if (typeof cleanups[index] === "function") cleanups[index]();
            else assignRef(ref, null);
          } catch (error) { failure ??= error; }
        });
        if (failure) throw failure;
      };
    };
  }, refs);
}
