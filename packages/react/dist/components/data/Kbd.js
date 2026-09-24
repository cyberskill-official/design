import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Kbd = React.forwardRef(function Kbd2({ children, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsx("kbd", { ref: forwardedRef, className: cx("cs-kbd", className), ...props, children });
});
export {
  Kbd
};
