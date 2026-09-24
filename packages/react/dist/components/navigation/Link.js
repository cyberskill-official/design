import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Link = React.forwardRef(function Link2({ href = "#", variant = "default", external = false, children, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs(
    "a",
    {
      ref: forwardedRef,
      href,
      className: cx("cs-link", variant !== "default" && "cs-link--" + variant, className),
      target: external ? "_blank" : void 0,
      rel: external ? "noopener noreferrer" : void 0,
      ...props,
      children: [
        children,
        external ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: " \u2197" }) : variant === "standalone" ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: " \u2192" }) : null
      ]
    }
  );
});
export {
  Link
};
