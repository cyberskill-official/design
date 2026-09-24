import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill StatusIndicator — coloured dot + label. status: online | busy | offline | error. */
export const StatusIndicator = React.forwardRef(function StatusIndicator({ status = "offline", pulse = false, children, className, ...props }, forwardedRef) {
  return (
    <span ref={forwardedRef} className={cx("cs-status", `cs-status--${status}`, pulse && "cs-status--pulse", className)} {...props}>
      <span className="cs-status__dot" aria-hidden="true" />
      {children}
    </span>
  );
});
