"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/button/ButtonGroup.jsx
import React from "react";
var ButtonGroup = React.forwardRef(function ButtonGroup2({ children, label, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { className: cx("cs-btngroup", className), role: "group", "aria-label": label, ...props, ref: mergedNativeRef }, children);
});
ButtonGroup.displayName = "ButtonGroup";

export {
  ButtonGroup
};
//# sourceMappingURL=chunk-YRIM6W5G.mjs.map
