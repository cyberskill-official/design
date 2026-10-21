"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Kbd.jsx
import React from "react";
var Kbd = React.forwardRef(function Kbd2({ children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("kbd", { className: cx("cs-kbd", className), ...props, ref: mergedNativeRef }, children);
});
Kbd.displayName = "Kbd";

export {
  Kbd
};
//# sourceMappingURL=chunk-E6BFYBQG.mjs.map
