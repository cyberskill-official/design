import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill StatusIndicator — coloured dot + label. status: online | busy | offline | error. */
export const StatusIndicator = React.forwardRef(function StatusIndicator({ status = "offline", pulse = false, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return (
    <span className={cx("cs-status", `cs-status--${status}`, pulse && "cs-status--pulse", className)} {...props} ref={mergedNativeRef} >
      <span className="cs-status__dot" aria-hidden="true" />
      {children}
    </span>
  );
});
StatusIndicator.displayName = "StatusIndicator";
