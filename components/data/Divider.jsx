import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Divider — hairline rule. `label` centres text; `vertical` for inline splits. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <hr> / label <div>.
export const Divider = React.forwardRef(function Divider({ vertical = false, label, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  if (label || label === 0) {
    return <div className={cx("cs-divider", "cs-divider--label", className)} role="separator" {...props} ref={mergedNativeRef} >{label}</div>;
  }
  return <hr className={cx("cs-divider", vertical && "cs-divider--vertical", className)} aria-orientation={vertical ? "vertical" : "horizontal"} {...props}  ref={mergedNativeRef} />;
});
Divider.displayName = "Divider";
