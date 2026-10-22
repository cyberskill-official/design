import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Kbd — keyboard key hint. */
export const Kbd = React.forwardRef(function Kbd({ children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return <kbd className={cx("cs-kbd", className)} {...props} ref={mergedNativeRef} >{children}</kbd>;
});
Kbd.displayName = "Kbd";
