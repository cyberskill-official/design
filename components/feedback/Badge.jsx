import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Badge — compact status label. variant: neutral | solid | ochre | success | danger | warning | info. */
export const Badge = React.forwardRef(function Badge({ variant = "neutral", dot = false, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return (
    <span className={cx("cs-badge", variant !== "neutral" && `cs-badge--${variant}`, className)} {...props} ref={mergedNativeRef} >
      {dot ? <span className="cs-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
});
Badge.displayName = "Badge";
