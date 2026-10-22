"use client";
import {
  mergeIds,
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/RadioGroup.jsx
import React from "react";
var Radio = React.forwardRef(function Radio2({ label, description, disabled = false, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const generatedId = React.useId();
  const hasLabel = Boolean(label) || label === 0;
  const hasDescription = Boolean(description) || description === 0;
  const labelId = hasLabel ? generatedId + "-label" : void 0;
  const descriptionId = hasDescription ? generatedId + "-description" : void 0;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : void 0);
  const describedBy = mergeIds(props["aria-describedby"], descriptionId);
  return /* @__PURE__ */ React.createElement("label", { className: cx("cs-radio", disabled && "is-disabled", className) }, /* @__PURE__ */ React.createElement("input", { type: "radio", disabled, ...props, "aria-labelledby": labelledBy, "aria-describedby": describedBy, ref: mergedNativeRef }), /* @__PURE__ */ React.createElement("span", { className: "cs-radio__text" }, /* @__PURE__ */ React.createElement("span", { id: labelId }, label), description || description === 0 ? /* @__PURE__ */ React.createElement("span", { id: descriptionId, className: "cs-radio__desc" }, description) : null));
});
Radio.displayName = "Radio";
var RadioGroup = React.forwardRef(function RadioGroup2({ legend, name, value, onChange, options = [], className, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const gid = React.useId();
  const nm = name ?? gid;
  return /* @__PURE__ */ React.createElement("fieldset", { ...mergeTargetProps({ "className": cx("cs-radio-group", className) }, rootProps, []), ref: mergedNativeRef }, legend || legend === 0 ? /* @__PURE__ */ React.createElement("legend", null, legend) : null, options.map((o) => /* @__PURE__ */ React.createElement(
    Radio,
    {
      key: o.value,
      name: nm,
      value: o.value,
      label: o.label,
      description: o.description,
      disabled: o.disabled,
      checked: value === o.value,
      onChange: () => onChange && onChange(o.value)
    }
  )));
});
RadioGroup.displayName = "RadioGroup";

export {
  Radio,
  RadioGroup
};
//# sourceMappingURL=chunk-WIZW3D4M.mjs.map
