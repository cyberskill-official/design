import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill ScrollArea — focusable overflow region for dense bilingual panels. */
export const ScrollArea = React.forwardRef(function ScrollArea({ children, maxHeight, className, style, ...props }, forwardedRef) {
  const max =
    maxHeight == null
      ? undefined
      : typeof maxHeight === "number"
        ? `${maxHeight}px`
        : maxHeight;
  return (
    <div ref={forwardedRef}
      className={cx("cs-scroll-area", className)}
      tabIndex={0}
      style={{
        ...(style || {}),
        ...(max != null ? { maxBlockSize: max } : {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
});
