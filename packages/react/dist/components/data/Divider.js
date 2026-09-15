import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Divider = React.forwardRef(function Divider2({ vertical = false, label, className, children, ...props }, forwardedRef) {
  if (label) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-divider", "cs-divider--label", className), role: "separator", ...props, children: label });
  }
  return /* @__PURE__ */ jsx("hr", { className: cx("cs-divider", vertical && "cs-divider--vertical", className), "aria-orientation": vertical ? "vertical" : "horizontal", ...props });
});
export {
  Divider
};
