"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/AspectRatio.jsx
import React from "react";
var AspectRatio = React.forwardRef(function AspectRatio2({ ratio = "16 / 9", children, className, style, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const ar = typeof ratio === "number" ? String(ratio) : ratio;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cx("cs-aspect-ratio", className),
      style: { ...style || {}, aspectRatio: ar },
      ...props,
      ref: mergedNativeRef
    },
    children
  );
});
AspectRatio.displayName = "AspectRatio";

export {
  AspectRatio
};
//# sourceMappingURL=chunk-K5Y6OG3R.mjs.map
