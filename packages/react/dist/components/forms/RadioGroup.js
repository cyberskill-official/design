import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Radio = React.forwardRef(function Radio2({ label, description, disabled = false, className, children, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs("label", { ref: forwardedRef, className: cx("cs-radio", disabled && "is-disabled", className), children: [
    /* @__PURE__ */ jsx("input", { type: "radio", disabled, ...props }),
    /* @__PURE__ */ jsxs("span", { className: "cs-radio__text", children: [
      /* @__PURE__ */ jsx("span", { children: label }),
      description ? /* @__PURE__ */ jsx("span", { className: "cs-radio__desc", children: description }) : null
    ] })
  ] });
});
const RadioGroup = React.forwardRef(function RadioGroup2({ legend, name, value, onChange, options = [], className }, forwardedRef) {
  const gid = React.useId();
  const nm = name ?? gid;
  return /* @__PURE__ */ jsxs("fieldset", { ref: forwardedRef, className: cx("cs-radio-group", className), children: [
    legend ? /* @__PURE__ */ jsx("legend", { children: legend }) : null,
    options.map((o) => /* @__PURE__ */ jsx(
      Radio,
      {
        name: nm,
        value: o.value,
        label: o.label,
        description: o.description,
        disabled: o.disabled,
        checked: value === o.value,
        onChange: () => onChange && onChange(o.value)
      },
      o.value
    ))
  ] });
});
export {
  Radio,
  RadioGroup
};
