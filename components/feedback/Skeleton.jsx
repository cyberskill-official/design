import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { cx } from "../_utils/cx.js";
import { renderCount } from "../_utils/renderCount.js";

/** CyberSkill Skeleton — shimmer placeholder. Use `lines` for text blocks, or variant="circle"/"block". */
export const Skeleton = React.forwardRef(function Skeleton({ variant = "block", width, height, lines: requestedLines, radius, className, style , rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const lines = renderCount(requestedLines, 0);
  if (lines) {
    return (
      <div {...mergeTargetProps({ "className": className }, rootProps, ["aria-hidden","role"])} aria-hidden="true" role="presentation" ref={mergedNativeRef} >
        {Array.from({ length: lines }).map((_, i) => (
          <span key={i} className="cs-skeleton cs-skeleton--text" style={{ width: i === lines - 1 ? "70%" : "100%" }} />
        ))}
      </div>
    );
  }
  return (
    <span
      {...mergeTargetProps({ "className": cx("cs-skeleton", variant === "circle" && "cs-skeleton--circle", className) }, rootProps, ["aria-hidden","role"])} style={{ ...rootProps?.style, ...({ display: "block", width, height, borderRadius: radius, ...style }) }}
      aria-hidden="true"

     ref={mergedNativeRef} />
  );
});
Skeleton.displayName = "Skeleton";
