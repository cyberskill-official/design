import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill ButtonGroup — joins adjacent Buttons into one segmented cluster (role=group). */
export const ButtonGroup = React.forwardRef(function ButtonGroup({ children, label, className, ...props }, forwardedRef) {
  return <div ref={forwardedRef} className={cx("cs-btngroup", className)} role="group" aria-label={label} {...props}>{children}</div>;
});
