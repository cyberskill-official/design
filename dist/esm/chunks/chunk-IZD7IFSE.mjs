"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/ScrollArea.jsx
import React from "react";
var ScrollArea = React.forwardRef(function ScrollArea2({ children, maxHeight, className, style, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const max = maxHeight == null ? void 0 : typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cx("cs-scroll-area", className),
      tabIndex: 0,
      style: {
        ...style || {},
        ...max != null ? { maxBlockSize: max } : {}
      },
      ...props,
      ref: mergedNativeRef
    },
    children
  );
});
ScrollArea.displayName = "ScrollArea";

export {
  ScrollArea
};
//# sourceMappingURL=chunk-IZD7IFSE.mjs.map
