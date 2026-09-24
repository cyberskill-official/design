import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Kbd — keyboard key hint. */
export const Kbd = React.forwardRef(function Kbd({ children, className, ...props }, forwardedRef) {
  return <kbd ref={forwardedRef} className={cx("cs-kbd", className)} {...props}>{children}</kbd>;
});
