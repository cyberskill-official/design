import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const ButtonGroup = React.forwardRef(function ButtonGroup2({ children, label, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-btngroup", className), role: "group", "aria-label": label, ...props, children });
});
export {
  ButtonGroup
};
