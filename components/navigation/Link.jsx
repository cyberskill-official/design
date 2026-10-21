import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Link — brand-styled anchor. variant: default | muted | standalone (arrow). external adds ↗ + rel. */
export const Link = React.forwardRef(function Link({ href = "#", variant = "default", external = false, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return (
    <a href={href} className={cx("cs-link", variant !== "default" && "cs-link--" + variant, className)}
      target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...props} ref={mergedNativeRef} >
      {children}
      {external ? <span aria-hidden="true"> ↗</span> : variant === "standalone" ? <span aria-hidden="true"> →</span> : null}
    </a>
  );
});
Link.displayName = "Link";
