import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Badge = React.forwardRef(function Badge2({ variant = "neutral", dot = false, children, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-badge", variant !== "neutral" && `cs-badge--${variant}`, className), ...props, children: [
    dot ? /* @__PURE__ */ jsx("span", { className: "cs-badge__dot", "aria-hidden": "true" }) : null,
    children
  ] });
});
export {
  Badge
};
