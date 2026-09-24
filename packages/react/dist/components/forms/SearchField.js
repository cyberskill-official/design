import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const SearchField = React.forwardRef(function SearchField2({ value, onChange, onClear, placeholder, lang, className, children, ...props }, forwardedRef) {
  const [inner, setInner] = React.useState("");
  const val = value != null ? value : inner;
  const set = (v) => onChange ? onChange(v) : setInner(v);
  const [ref, L] = useLang(lang);
  const t = makeT("SearchField", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-search", className), children: [
    /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
      /* @__PURE__ */ jsx("path", { d: "M21 21l-4.3-4.3" })
    ] }),
    /* @__PURE__ */ jsx("input", { ...props, type: "text", role: "searchbox", value: val, placeholder: ph, onChange: (e) => set(e.target.value) }),
    String(val).length ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-search__clear", "aria-label": t("clear"), onClick: () => {
      set("");
      onClear && onClear();
    }, children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) }) : null
  ] });
});
export {
  SearchField
};
