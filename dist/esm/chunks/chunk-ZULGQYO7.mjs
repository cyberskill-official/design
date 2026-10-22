"use client";
import {
  renderCount
} from "./chunk-5MIGZVWB.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/feedback/Skeleton.jsx
import React from "react";
var Skeleton = React.forwardRef(function Skeleton2({ variant = "block", width, height, lines: requestedLines, radius, className, style, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const lines = renderCount(requestedLines, 0);
  if (lines) {
    return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ "className": className }, rootProps, ["aria-hidden", "role"]), "aria-hidden": "true", role: "presentation", ref: mergedNativeRef }, Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "cs-skeleton cs-skeleton--text", style: { width: i === lines - 1 ? "70%" : "100%" } })));
  }
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      ...mergeTargetProps({ "className": cx("cs-skeleton", variant === "circle" && "cs-skeleton--circle", className) }, rootProps, ["aria-hidden", "role"]),
      style: { ...rootProps?.style, ...{ display: "block", width, height, borderRadius: radius, ...style } },
      "aria-hidden": "true",
      ref: mergedNativeRef
    }
  );
});
Skeleton.displayName = "Skeleton";

export {
  Skeleton
};
//# sourceMappingURL=chunk-ZULGQYO7.mjs.map
