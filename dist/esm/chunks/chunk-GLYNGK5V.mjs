"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/feedback/StatusIndicator.jsx
import React from "react";
var StatusIndicator = React.forwardRef(function StatusIndicator2({ status = "offline", pulse = false, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("span", { className: cx("cs-status", `cs-status--${status}`, pulse && "cs-status--pulse", className), ...props, ref: mergedNativeRef }, /* @__PURE__ */ React.createElement("span", { className: "cs-status__dot", "aria-hidden": "true" }), children);
});
StatusIndicator.displayName = "StatusIndicator";

export {
  StatusIndicator
};
//# sourceMappingURL=chunk-GLYNGK5V.mjs.map
