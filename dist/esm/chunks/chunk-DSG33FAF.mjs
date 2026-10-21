"use client";
import {
  mergeIds
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/NativeSelect.jsx
import React from "react";
var NativeSelect = React.forwardRef(function NativeSelect2({
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
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const hasError = Boolean(error) || error === 0;
  const gid = React.useId();
  const sid = id ?? gid;
  const hasLabel = Boolean(label) || label === 0;
  const labelId = hasLabel ? sid + "-label" : void 0;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : void 0);
  const errId = hasError ? sid + "-err" : void 0;
  const describedBy = mergeIds(props["aria-describedby"], errId);
  return /* @__PURE__ */ React.createElement("label", { className: cx("cs-field", "cs-native-select-field", disabled && "is-disabled", hasError && "is-invalid", className), htmlFor: sid }, label || label === 0 ? /* @__PURE__ */ React.createElement("span", { id: labelId, className: "cs-field__label" }, label) : null, /* @__PURE__ */ React.createElement("span", { className: cx("cs-native-select", `cs-native-select--${size}`) }, /* @__PURE__ */ React.createElement(
    "select",
    {
      ...props,
      id: sid,
      disabled,
      value,
      defaultValue,
      onChange,
      "aria-invalid": hasError ? true : props["aria-invalid"],
      "aria-labelledby": labelledBy,
      "aria-describedby": describedBy,
      className: "cs-field__control",
      ref: mergedNativeRef
    },
    options ? options.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.value, value: o.value, disabled: o.disabled }, o.label)) : children
  ), /* @__PURE__ */ React.createElement("span", { className: "cs-native-select__chevron", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 9l6 6 6-6" })))), hasError ? /* @__PURE__ */ React.createElement("span", { id: errId, className: "cs-field__error", role: "alert" }, error) : null);
});
NativeSelect.displayName = "NativeSelect";

export {
  NativeSelect
};
//# sourceMappingURL=chunk-DSG33FAF.mjs.map
