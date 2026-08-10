import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill ProgressBar — determinate progress. variant: ochre (default) | umber | success. */
export function ProgressBar({ value = 0, max = 100, variant, label, lang, className }) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.max(0, Math.min(safeMax, Number(value) || 0));
  const pct = Math.max(0, Math.min(100, (clamped / safeMax) * 100));
  const [ref, L] = useLang(lang);
  const t = makeT("ProgressBar", L);
  return (
    <div ref={ref} className={cx("cs-progress", variant && `cs-progress--${variant}`, className)}
      role="progressbar" aria-valuenow={Math.round(clamped)} aria-valuemin={0} aria-valuemax={safeMax} aria-label={label ?? t("label")}>
      <span className="cs-progress__fill" style={{ inlineSize: pct + "%", width: pct + "%" }} />
    </div>
  );
}
