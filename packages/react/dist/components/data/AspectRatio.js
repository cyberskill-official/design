import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const AspectRatio = React.forwardRef(function AspectRatio2({ ratio = "16 / 9", children, className, style, ...props }, forwardedRef) {
  const ar = typeof ratio === "number" ? String(ratio) : ratio;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: forwardedRef,
      className: cx("cs-aspect-ratio", className),
      style: { ...style || {}, aspectRatio: ar },
      ...props,
      children
    }
  );
});
export {
  AspectRatio
};
