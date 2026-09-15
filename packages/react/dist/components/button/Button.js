import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Button = React.forwardRef(function Button2({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  children,
  className,
  type = "button",
  ...props
}, ref) {
  const isDisabled = disabled || loading;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ...props,
      ref,
      type,
      disabled: isDisabled,
      "aria-busy": loading || void 0,
      className: cx(
        "cs-button",
        `cs-button--${variant}`,
        `cs-button--${size}`,
        fullWidth && "cs-button--full",
        isDisabled && "is-disabled",
        loading && "is-loading",
        className
      ),
      children: [
        icon ? /* @__PURE__ */ jsx("span", { className: "cs-button__icon", "aria-hidden": "true", children: icon }) : null,
        /* @__PURE__ */ jsx("span", { className: "cs-button__label", children }),
        loading ? /* @__PURE__ */ jsx("span", { className: "cs-button__spinner", "aria-hidden": "true" }) : null
      ]
    }
  );
});
export {
  Button
};
