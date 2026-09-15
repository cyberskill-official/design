import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Textarea = React.forwardRef(function Textarea2({ id, label, description, error, disabled = false, rows = 4, className, ...props }, forwardedRef) {
  const gid = React.useId();
  const tid = id ?? gid;
  const descId = description ? tid + "-desc" : void 0;
  const errId = error ? tid + "-err" : void 0;
  const describedBy = [descId, errId].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs("label", { ref: forwardedRef, className: cx("cs-field", disabled && "is-disabled", error && "is-invalid", className), htmlFor: tid, children: [
    label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
    description ? /* @__PURE__ */ jsx("span", { id: descId, className: "cs-field__description", children: description }) : null,
    /* @__PURE__ */ jsx("textarea", { ...props, id: tid, rows, disabled, "aria-invalid": error ? true : void 0, "aria-describedby": describedBy, className: "cs-field__control" }),
    error ? /* @__PURE__ */ jsx("span", { id: errId, className: "cs-field__error", role: "alert", children: error }) : null
  ] });
});
export {
  Textarea
};
