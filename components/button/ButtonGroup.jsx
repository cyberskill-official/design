import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill ButtonGroup — joins adjacent Buttons into one segmented cluster (role=group). */
export const ButtonGroup = React.forwardRef(function ButtonGroup({ children, label, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return <div className={cx("cs-btngroup", className)} role="group" aria-label={label} {...props} ref={mergedNativeRef} >{children}</div>;
});
ButtonGroup.displayName = "ButtonGroup";
