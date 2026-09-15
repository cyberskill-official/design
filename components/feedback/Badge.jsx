import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Badge — compact status label. variant: neutral | solid | ochre | success | danger | warning | info. */
export const Badge = React.forwardRef(function Badge({ variant = "neutral", dot = false, children, className, ...props }, forwardedRef) {
  return (
    <span ref={forwardedRef} className={cx("cs-badge", variant !== "neutral" && `cs-badge--${variant}`, className)} {...props}>
      {dot ? <span className="cs-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
});
