import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const LumiAvatar = React.forwardRef(function LumiAvatar2({ src, size = "md", ring = false, alt = "Lumi", className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsx("span", { ref: forwardedRef, className: cx("cs-lumi", `cs-lumi--${size}`, ring && "cs-lumi--ring", className), ...props, children: src ? /* @__PURE__ */ jsx("img", { src, alt }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u2726" }) });
});
export {
  LumiAvatar
};
