import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const ScrollArea = React.forwardRef(function ScrollArea2({ children, maxHeight, className, style, ...props }, forwardedRef) {
  const max = maxHeight == null ? void 0 : typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: forwardedRef,
      className: cx("cs-scroll-area", className),
      tabIndex: 0,
      style: {
        ...style || {},
        ...max != null ? { maxBlockSize: max } : {}
      },
      ...props,
      children
    }
  );
});
export {
  ScrollArea
};
