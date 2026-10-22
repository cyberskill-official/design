"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/feedback/Badge.jsx
import React from "react";
var Badge = React.forwardRef(function Badge2({ variant = "neutral", dot = false, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("span", { className: cx("cs-badge", variant !== "neutral" && `cs-badge--${variant}`, className), ...props, ref: mergedNativeRef }, dot ? /* @__PURE__ */ React.createElement("span", { className: "cs-badge__dot", "aria-hidden": "true" }) : null, children);
});
Badge.displayName = "Badge";

export {
  Badge
};
//# sourceMappingURL=chunk-QJ327MUQ.mjs.map
