import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill AspectRatio — CSS aspect-ratio lock for media and framed content. */
export const AspectRatio = React.forwardRef(function AspectRatio({ ratio = "16 / 9", children, className, style, ...props }, forwardedRef) {
  const ar = typeof ratio === "number" ? String(ratio) : ratio;
  return (
    <div ref={forwardedRef}
      className={cx("cs-aspect-ratio", className)}
      style={{ ...(style || {}), aspectRatio: ar }}
      {...props}
    >
      {children}
    </div>
  );
});
