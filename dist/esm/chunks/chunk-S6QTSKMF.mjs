"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Divider.jsx
import React from "react";
var Divider = React.forwardRef(function Divider2({ vertical = false, label, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  if (label || label === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: cx("cs-divider", "cs-divider--label", className), role: "separator", ...props, ref: mergedNativeRef }, label);
  }
  return /* @__PURE__ */ React.createElement("hr", { className: cx("cs-divider", vertical && "cs-divider--vertical", className), "aria-orientation": vertical ? "vertical" : "horizontal", ...props, ref: mergedNativeRef });
});
Divider.displayName = "Divider";

export {
  Divider
};
//# sourceMappingURL=chunk-S6QTSKMF.mjs.map
