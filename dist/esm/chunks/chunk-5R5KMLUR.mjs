"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  fieldMessages,
  mergeTargetProps,
  useFieldAssociation
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/NumberField.jsx
import React from "react";
var NumberField = React.forwardRef(function NumberField2({
  id,
  label,
  value,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  lang,
  className,
  children,
  rootProps,
  controlProps,
  description,
  error,
  required = false,
  ...props
}, forwardedRef) {
  const [inner, setInner] = React.useState(() => defaultValue);
  const inputRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(inputRef, forwardedRef);
  const val = value != null ? value : inner;
  const clamp = (n) => {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return n;
  };
  const set = (n) => {
    const c = clamp(n);
    if (value == null) setInner(c);
    onChange?.(c);
  };
  const stepBy = (direction) => {
    const input = inputRef.current;
    if (!input) return;
    const probe = input.cloneNode(false);
    probe.value = input.value;
    probe.stepUp(direction);
    if (Number.isFinite(probe.valueAsNumber)) set(probe.valueAsNumber);
  };
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("NumberField", L, localeMessages);
  const control = useFieldAssociation(mergeTargetProps({
    ...props,
    id: controlProps?.id ?? id,
    type: "number",
    value: val,
    min,
    max,
    step,
    disabled,
    "aria-label": props["aria-label"] ?? label,
    onChange: (e) => {
      const raw = e.target.value;
      if (raw === "") {
        if (value == null) setInner("");
        return;
      }
      const num = Number(raw);
      if (Number.isFinite(num)) set(num);
    },
    onBlur: (e) => {
      if (inner === "" && value == null) setInner(clamp(0));
      props.onBlur?.(e);
    }
  }, controlProps, ["role", "type", "value", "defaultValue", "onChange", "min", "max", "step", "disabled"]), { id: controlProps?.id ?? id, fallbackLabel: label ? void 0 : t("value"), nativeRequired: true, description, error, required });
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ className: cx("cs-field", disabled && "is-disabled", className) }, rootProps), ref }, label ? /* @__PURE__ */ React.createElement("label", { className: "cs-field__label", htmlFor: control.id }, label) : null, /* @__PURE__ */ React.createElement("div", { className: "cs-stepper" }, /* @__PURE__ */ React.createElement("button", { type: "button", "aria-label": t("decrease"), disabled: disabled || min != null && val !== "" && val <= min, onClick: () => stepBy(-1) }, "−"), /* @__PURE__ */ React.createElement("input", { ...control, ref: mergedNativeRef }), /* @__PURE__ */ React.createElement("button", { type: "button", "aria-label": t("increase"), disabled: disabled || max != null && val !== "" && val >= max, onClick: () => stepBy(1) }, "+")), fieldMessages(control, description, error));
});
NumberField.displayName = "NumberField";

export {
  NumberField
};
//# sourceMappingURL=chunk-5R5KMLUR.mjs.map
