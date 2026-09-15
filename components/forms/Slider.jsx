import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Slider — brand-tinted native range input. Pass native props (min/max/step/value/onChange). */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export const Slider = React.forwardRef(function Slider({ className, children, lang, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Slider", L);
  return <input ref={mergeRefs(ref, forwardedRef)} type="range" className={cx("cs-slider", className)} aria-label={ariaLabel ?? t("label")} {...props} />;
});
