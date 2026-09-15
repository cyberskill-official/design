import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Select = React.forwardRef(function Select2({ id, label, description, error, options, children, disabled = false, lang, className, placeholder, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Select", L);
  const gid = React.useId();
  const sid = id ?? gid;
  const descId = description ? sid + "-desc" : void 0;
  const errId = error ? sid + "-err" : void 0;
  const describedBy = [descId, errId].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-field", disabled && "is-disabled", error && "is-invalid", className), htmlFor: sid, children: [
    label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
    description ? /* @__PURE__ */ jsx("span", { id: descId, className: "cs-field__description", children: description }) : null,
    /* @__PURE__ */ jsxs("span", { className: "cs-select", children: [
      /* @__PURE__ */ jsxs("select", { ...props, id: sid, disabled, "aria-invalid": error ? true : void 0, "aria-describedby": describedBy, className: "cs-field__control", children: [
        placeholder != null || !children ? /* @__PURE__ */ jsx("option", { value: "", disabled: true, hidden: true, children: placeholder ?? t("placeholder") }) : null,
        options ? options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value)) : children
      ] }),
      /* @__PURE__ */ jsx("span", { className: "cs-select__chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
    ] }),
    error ? /* @__PURE__ */ jsx("span", { id: errId, className: "cs-field__error", role: "alert", children: error }) : null
  ] });
});
export {
  Select
};
