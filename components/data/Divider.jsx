import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Divider — hairline rule. `label` centres text; `vertical` for inline splits. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <hr> / label <div>.
export const Divider = React.forwardRef(function Divider({ vertical = false, label, className, children, ...props }, forwardedRef) {
  if (label) {
    return <div ref={forwardedRef} className={cx("cs-divider", "cs-divider--label", className)} role="separator" {...props}>{label}</div>;
  }
  return <hr className={cx("cs-divider", vertical && "cs-divider--vertical", className)} aria-orientation={vertical ? "vertical" : "horizontal"} {...props} />;
});
