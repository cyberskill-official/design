import { jsx } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Slider = React.forwardRef(function Slider2({ className, children, lang, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Slider", L);
  return /* @__PURE__ */ jsx("input", { ref: mergeRefs(ref, forwardedRef), type: "range", className: cx("cs-slider", className), "aria-label": ariaLabel ?? t("label"), ...props });
});
export {
  Slider
};
