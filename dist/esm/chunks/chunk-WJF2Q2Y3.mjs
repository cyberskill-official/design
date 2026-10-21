"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  mergeIds
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/InputGroup.jsx
import React from "react";
var EYE = /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3" }));
var EYE_OFF = /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M4 4l16 16" }));
var X = /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" }));
var InputGroup = React.forwardRef(function InputGroup2({
  id,
  label,
  prefix,
  suffix,
  clearable = false,
  password = false,
  value,
  onChange,
  defaultValue = "",
  placeholder,
  disabled = false,
  readOnly = false,
  lang,
  className,
  ...props
}, forwardedRef) {
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const set = (v) => {
    if (disabled || readOnly) return;
    if (value == null) setInner(v);
    onChange && onChange(v);
  };
  const [show, setShow] = React.useState(false);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("InputGroup", L, localeMessages);
  const gid = React.useId();
  const sid = id ?? gid;
  const hasLabel = Boolean(label) || label === 0;
  const labelId = hasLabel ? sid + "-label" : void 0;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : void 0);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, className: cx("cs-field", disabled && "is-disabled", className) }, hasLabel ? /* @__PURE__ */ React.createElement("label", { id: labelId, className: "cs-field__label", htmlFor: sid }, label) : null, /* @__PURE__ */ React.createElement("span", { className: "cs-igroup" }, prefix != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-igroup__fix" }, prefix) : null, /* @__PURE__ */ React.createElement(
    "input",
    {
      ...props,
      id: sid,
      type: password && !show ? "password" : "text",
      value: val,
      placeholder,
      disabled,
      readOnly,
      "aria-labelledby": labelledBy,
      "aria-describedby": mergeIds(props["aria-describedby"]),
      "aria-label": props["aria-label"] ?? (hasLabel || props["aria-labelledby"] != null ? void 0 : placeholder || t("input")),
      onChange: (e) => set(e.target.value)
    }
  ), clearable && String(val).length ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-igroup__btn", "aria-label": t("clear"), disabled: disabled || readOnly, onClick: () => set("") }, X) : null, password ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-igroup__btn", "aria-label": show ? t("hide") : t("show"), "aria-pressed": show, disabled, onClick: () => setShow((s) => !s) }, show ? EYE_OFF : EYE) : null, suffix != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-igroup__fix cs-igroup__fix--suffix" }, suffix) : null));
});
InputGroup.displayName = "InputGroup";

export {
  InputGroup
};
//# sourceMappingURL=chunk-WJF2Q2Y3.mjs.map
