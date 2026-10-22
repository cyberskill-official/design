import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill ProgressBar — determinate progress. variant: ochre (default) | umber | success. */
export const ProgressBar = React.forwardRef(function ProgressBar({ value = 0, max = 100, variant, label, lang, className , rootProps }, forwardedRef) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const clamped = Math.max(0, Math.min(safeMax, Number(value) || 0));
  const pct = Math.max(0, Math.min(100, (clamped / safeMax) * 100));
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("ProgressBar", L, localeMessages);
  return (
    <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-progress", variant && `cs-progress--${variant}`, className) }, rootProps, ["role","aria-valuenow","aria-valuemin","aria-valuemax","aria-label"])}
      role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={safeMax} aria-label={label ?? t("label")}>
      <span className="cs-progress__fill" style={{ inlineSize: pct + "%", width: pct + "%" }} />
    </div>
  );
});
ProgressBar.displayName = "ProgressBar";
