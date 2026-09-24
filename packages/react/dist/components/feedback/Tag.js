import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Tag = React.forwardRef(function Tag2({ children, onRemove, removeLabel, lang, className, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const rl = removeLabel != null ? removeLabel : makeT("Tag", L)("remove");
  return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-tag", className), ...props, children: [
    children,
    onRemove ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-tag__close", "aria-label": rl, onClick: onRemove, children: /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) }) : null
  ] });
});
export {
  Tag
};
