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

// components/forms/Select.jsx
import React from "react";
var Select = React.forwardRef(function Select2({ id, label, description, error, options, children, disabled = false, lang, className, placeholder, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Select", L, localeMessages);
  const hasError = Boolean(error) || error === 0;
  const hasDescription = Boolean(description) || description === 0;
  const gid = React.useId();
  const sid = id ?? gid;
  const hasLabel = Boolean(label) || label === 0;
  const labelId = hasLabel ? sid + "-label" : void 0;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : void 0);
  const descId = hasDescription ? sid + "-desc" : void 0;
  const errId = hasError ? sid + "-err" : void 0;
  const describedBy = mergeIds(props["aria-describedby"], descId, errId);
  return /* @__PURE__ */ React.createElement("label", { ref, className: cx("cs-field", disabled && "is-disabled", hasError && "is-invalid", className), htmlFor: sid }, label || label === 0 ? /* @__PURE__ */ React.createElement("span", { id: labelId, className: "cs-field__label" }, label) : null, hasDescription ? /* @__PURE__ */ React.createElement("span", { id: descId, className: "cs-field__description" }, description) : null, /* @__PURE__ */ React.createElement("span", { className: "cs-select" }, /* @__PURE__ */ React.createElement("select", { ...props, id: sid, disabled, "aria-invalid": hasError ? true : props["aria-invalid"], "aria-labelledby": labelledBy, "aria-describedby": describedBy, className: "cs-field__control", ref: mergedNativeRef }, placeholder != null || !children ? /* @__PURE__ */ React.createElement("option", { value: "", disabled: true, hidden: true }, placeholder ?? t("placeholder")) : null, options ? options.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.value, value: o.value }, o.label)) : children), /* @__PURE__ */ React.createElement("span", { className: "cs-select__chevron", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 9l6 6 6-6" })))), hasError ? /* @__PURE__ */ React.createElement("span", { id: errId, className: "cs-field__error", role: "alert" }, error) : null);
});
Select.displayName = "Select";

export {
  Select
};
//# sourceMappingURL=chunk-TN2MZXGS.mjs.map
