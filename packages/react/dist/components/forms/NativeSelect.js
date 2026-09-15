import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const NativeSelect = React.forwardRef(function NativeSelect2({
  id,
  label,
  error,
  options,
  children,
  disabled = false,
  size = "md",
  className,
  value,
  defaultValue,
  onChange,
  ...props
}, forwardedRef) {
  const gid = React.useId();
  const sid = id ?? gid;
  const errId = error ? sid + "-err" : void 0;
  return /* @__PURE__ */ jsxs("label", { ref: forwardedRef, className: cx("cs-field", "cs-native-select-field", disabled && "is-disabled", error && "is-invalid", className), htmlFor: sid, children: [
    label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
    /* @__PURE__ */ jsxs("span", { className: cx("cs-native-select", `cs-native-select--${size}`), children: [
      /* @__PURE__ */ jsx(
        "select",
        {
          ...props,
          id: sid,
          disabled,
          value,
          defaultValue,
          onChange,
          "aria-invalid": error ? true : void 0,
          "aria-describedby": errId,
          className: "cs-field__control",
          children: options ? options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, disabled: o.disabled, children: o.label }, o.value)) : children
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "cs-native-select__chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
    ] }),
    error ? /* @__PURE__ */ jsx("span", { id: errId, className: "cs-field__error", role: "alert", children: error }) : null
  ] });
});
export {
  NativeSelect
};
