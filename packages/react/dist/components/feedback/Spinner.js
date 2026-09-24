import { jsx } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Spinner = React.forwardRef(function Spinner2({ size = 20, label, lang, className, style, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const lbl = label != null ? label : makeT("Spinner", L)("label");
  return /* @__PURE__ */ jsx("span", { ref: mergeRefs(ref, forwardedRef), role: "status", "aria-label": lbl, className: cx("cs-spinner", className), style: { inlineSize: size, blockSize: size, width: size, height: size, ...style }, ...props });
});
export {
  Spinner
};
