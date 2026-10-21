"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/button/Button.jsx
import React from "react";
var Button = React.forwardRef(function Button2({
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
}, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const isDisabled = disabled || loading;
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      ...props,
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
      ref: mergedNativeRef
    },
    icon || icon === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cs-button__icon", "aria-hidden": "true" }, icon) : null,
    /* @__PURE__ */ React.createElement("span", { className: "cs-button__label" }, children),
    loading ? /* @__PURE__ */ React.createElement("span", { className: "cs-button__spinner", "aria-hidden": "true" }) : null
  );
});
Button.displayName = "Button";

export {
  Button
};
//# sourceMappingURL=chunk-PZON26K7.mjs.map
