import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const EYE = /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
] });
const EYE_OFF = /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" }),
  /* @__PURE__ */ jsx("path", { d: "M4 4l16 16" })
] });
const X = /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) });
const InputGroup = React.forwardRef(function InputGroup2({
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
  lang,
  className,
  "aria-label": ariaLabel,
  ...props
}, forwardedRef) {
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const set = (v) => {
    if (value == null) setInner(v);
    onChange && onChange(v);
  };
  const [show, setShow] = React.useState(false);
  const [ref, L] = useLang(lang);
  const t = makeT("InputGroup", L);
  const gid = React.useId();
  const sid = id ?? gid;
  return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-field", disabled && "is-disabled", className), htmlFor: sid, children: [
    label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
    /* @__PURE__ */ jsxs("span", { className: "cs-igroup", children: [
      prefix != null ? /* @__PURE__ */ jsx("span", { className: "cs-igroup__fix", children: prefix }) : null,
      /* @__PURE__ */ jsx(
        "input",
        {
          ...props,
          id: sid,
          type: password && !show ? "password" : "text",
          value: val,
          placeholder,
          disabled,
          "aria-label": label ? void 0 : ariaLabel || placeholder || t("input"),
          onChange: (e) => set(e.target.value)
        }
      ),
      clearable && String(val).length ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-igroup__btn", "aria-label": t("clear"), onClick: () => set(""), children: X }) : null,
      password ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-igroup__btn", "aria-label": show ? t("hide") : t("show"), "aria-pressed": show, onClick: () => setShow((s) => !s), children: show ? EYE_OFF : EYE }) : null,
      suffix != null ? /* @__PURE__ */ jsx("span", { className: "cs-igroup__fix cs-igroup__fix--suffix", children: suffix }) : null
    ] })
  ] });
});
export {
  InputGroup
};
