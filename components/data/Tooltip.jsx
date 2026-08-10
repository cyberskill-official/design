import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Tooltip — hover/focus bubble above the trigger. Keep label short. */
export function Tooltip({ label, children, lang, className }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Tooltip", L);
  return (
    <span ref={ref} className={cx("cs-tooltip", className)}>
      {children}
      <span className="cs-tooltip__bubble" role="tooltip">{label ?? t("label")}</span>
    </span>
  );
}
