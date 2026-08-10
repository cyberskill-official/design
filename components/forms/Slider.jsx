import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Slider — brand-tinted native range input. Pass native props (min/max/step/value/onChange). */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export function Slider({ className, children, lang, "aria-label": ariaLabel, ...props }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Slider", L);
  return <input ref={ref} type="range" className={cx("cs-slider", className)} aria-label={ariaLabel ?? t("label")} {...props} />;
}
