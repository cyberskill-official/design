import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const StatusIndicator = React.forwardRef(function StatusIndicator2({ status = "offline", pulse = false, children, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-status", `cs-status--${status}`, pulse && "cs-status--pulse", className), ...props, children: [
    /* @__PURE__ */ jsx("span", { className: "cs-status__dot", "aria-hidden": "true" }),
    children
  ] });
});
export {
  StatusIndicator
};
