import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Checkbox = React.forwardRef(function Checkbox2({ label, description, disabled = false, className, children, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs("label", { ref: forwardedRef, className: cx("cs-check", disabled && "is-disabled", className), children: [
    /* @__PURE__ */ jsx("input", { type: "checkbox", disabled, ...props }),
    /* @__PURE__ */ jsxs("span", { className: "cs-check__text", children: [
      /* @__PURE__ */ jsx("span", { children: label }),
      description ? /* @__PURE__ */ jsx("span", { className: "cs-check__desc", children: description }) : null
    ] })
  ] });
});
export {
  Checkbox
};
