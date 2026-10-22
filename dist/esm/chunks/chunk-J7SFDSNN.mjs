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

// components/forms/Textarea.jsx
import React from "react";
var Textarea = React.forwardRef(function Textarea2({ id, label, description, error, disabled = false, rows = 4, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const hasError = Boolean(error) || error === 0;
  const hasDescription = Boolean(description) || description === 0;
  const gid = React.useId();
  const tid = id ?? gid;
  const hasLabel = Boolean(label) || label === 0;
  const labelId = hasLabel ? tid + "-label" : void 0;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : void 0);
  const descId = hasDescription ? tid + "-desc" : void 0;
  const errId = hasError ? tid + "-err" : void 0;
  const describedBy = mergeIds(props["aria-describedby"], descId, errId);
  return /* @__PURE__ */ React.createElement("label", { className: cx("cs-field", disabled && "is-disabled", hasError && "is-invalid", className), htmlFor: tid }, label || label === 0 ? /* @__PURE__ */ React.createElement("span", { id: labelId, className: "cs-field__label" }, label) : null, hasDescription ? /* @__PURE__ */ React.createElement("span", { id: descId, className: "cs-field__description" }, description) : null, /* @__PURE__ */ React.createElement("textarea", { ...props, id: tid, rows, disabled, "aria-invalid": hasError ? true : props["aria-invalid"], "aria-labelledby": labelledBy, "aria-describedby": describedBy, className: "cs-field__control", ref: mergedNativeRef }), hasError ? /* @__PURE__ */ React.createElement("span", { id: errId, className: "cs-field__error", role: "alert" }, error) : null);
});
Textarea.displayName = "Textarea";

export {
  Textarea
};
//# sourceMappingURL=chunk-J7SFDSNN.mjs.map
