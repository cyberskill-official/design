import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Skeleton — shimmer placeholder. Use `lines` for text blocks, or variant="circle"/"block". */
export const Skeleton = React.forwardRef(function Skeleton({ variant = "block", width, height, lines, radius, className, style }, forwardedRef) {
  if (lines) {
    return (
      <div ref={forwardedRef} className={className} aria-hidden="true" role="presentation">
        {Array.from({ length: lines }).map((_, i) => (
          <span key={i} className="cs-skeleton cs-skeleton--text" style={{ width: i === lines - 1 ? "70%" : "100%" }} />
        ))}
      </div>
    );
  }
  return (
    <span
      className={cx("cs-skeleton", variant === "circle" && "cs-skeleton--circle", className)}
      aria-hidden="true"
      style={{ display: "block", width, height, borderRadius: radius, ...style }}
    />
  );
});
