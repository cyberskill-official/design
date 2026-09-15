import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const TypingIndicator = React.forwardRef(function TypingIndicator2({ label, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const lbl = label != null ? label : makeT("TypingIndicator", L)("label");
  return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-typing", className), role: "status", "aria-label": lbl, children: [
    /* @__PURE__ */ jsx("span", {}),
    /* @__PURE__ */ jsx("span", {}),
    /* @__PURE__ */ jsx("span", {})
  ] });
});
export {
  TypingIndicator
};
