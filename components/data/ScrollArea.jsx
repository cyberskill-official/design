import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill ScrollArea — focusable overflow region for dense bilingual panels. */
export const ScrollArea = React.forwardRef(function ScrollArea({ children, maxHeight, className, style, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const max =
    maxHeight == null
      ? undefined
      : typeof maxHeight === "number"
        ? `${maxHeight}px`
        : maxHeight;
  return (
    <div
      className={cx("cs-scroll-area", className)}
      tabIndex={0}
      style={{
        ...(style || {}),
        ...(max != null ? { maxBlockSize: max } : {}),
      }}
      {...props}
     ref={mergedNativeRef} >
      {children}
    </div>
  );
});
ScrollArea.displayName = "ScrollArea";
