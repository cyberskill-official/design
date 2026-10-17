import React from "react";
import { cx } from "../_utils/cx.js";
import { renderCount } from "../_utils/renderCount.js";

/** CyberSkill Skeleton — shimmer placeholder. Use `lines` for text blocks, or variant="circle"/"block". */
export function Skeleton({ variant = "block", width, height, lines: requestedLines, radius, className, style }) {
  const lines = renderCount(requestedLines, 0);
  if (lines) {
    return (
      <div className={className} aria-hidden="true" role="presentation">
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
}
