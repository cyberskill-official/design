import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { renderCount } from "../_utils/renderCount.js";

const TONE = {
  low: { color: "var(--cs-color-semantic-danger)", textColor: "var(--cs-color-semantic-danger-text)", label: "Low", fill: 2 },
  medium: { color: "var(--cs-color-semantic-warning)", textColor: "var(--cs-color-semantic-warning-text)", label: "Medium", fill: 3 },
  high: { color: "var(--cs-color-semantic-success)", textColor: "var(--cs-color-semantic-success-text)", label: "High", fill: 5 },
};

/**
 * CyberSkill ConfidenceMeter — segmented AI-confidence indicator. Pass a numeric
 * `value` 0–1, or a `level` ("low"|"medium"|"high"). Confidence is stated in
 * words too, never colour alone — pair with AIDisclosureBadge / HumanReviewGate
 * for disclosure and review controls. Values and levels are caller-supplied;
 * this display does not calculate calibrated confidence or verify provenance.
 */
export function ConfidenceMeter({ value, level, segments = 5, label, lang, className }) {
  let tone, filled;
  const segs = renderCount(Number(segments) || 5, 5, 1);
  if (value != null) {
    const v = Math.max(0, Math.min(1, Number(value) || 0));
    tone = v < 0.4 ? "low" : v < 0.75 ? "medium" : "high";
    filled = Math.max(0, Math.min(segs, Math.round(v * segs)));
  } else {
    tone = TONE[level] ? level : "medium";
    filled = Math.max(0, Math.min(segs, Math.round((TONE[tone].fill / 5) * segs)));
  }
  const meta = TONE[tone];
  const [ref, L] = useLang(lang);
  const nameId = React.useId();
  const t = makeT("ConfidenceMeter", L);
  const lbl = label != null ? label : t("label");
  const levelText = t(tone);
  return (
    <div ref={ref} className={cx("cs-confidence", className)}>
      <div className="cs-confidence__head">
        <span id={nameId + "-label"}>{lbl}</span>
        <span id={nameId + "-level"} className="cs-confidence__level" style={{ color: meta.textColor }}>{levelText}</span>
      </div>
      <div className="cs-confidence__track" role="meter" aria-valuemin={0} aria-valuemax={segs} aria-valuenow={filled} aria-labelledby={nameId + "-label " + nameId + "-level"}>
        {Array.from({ length: segs }).map((_, i) => (
          <span key={i} className="cs-confidence__seg" style={i < filled ? { background: meta.color } : undefined} />
        ))}
      </div>
    </div>
  );
}
