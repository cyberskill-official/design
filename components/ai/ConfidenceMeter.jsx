import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

const TONE = {
  low: { color: "var(--cs-color-semantic-danger)", label: "Low", fill: 2 },
  medium: { color: "var(--cs-color-semantic-warning)", label: "Medium", fill: 3 },
  high: { color: "var(--cs-color-semantic-success)", label: "High", fill: 5 },
};

/**
 * CyberSkill ConfidenceMeter — segmented AI-confidence indicator. Pass a numeric
 * `value` 0–1, or a `level` ("low"|"medium"|"high"). Confidence is stated in
 * words too, never colour alone — pair with AIDisclosureBadge / HumanReviewGate.
 */
export function ConfidenceMeter({ value, level, segments = 5, label, lang, className }) {
  let tone, filled;
  const segs = Math.max(1, Number(segments) || 5);
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
  const t = makeT("ConfidenceMeter", L);
  const lbl = label != null ? label : t("label");
  const levelText = t(tone);
  return (
    <div ref={ref} className={cx("cs-confidence", className)}>
      <div className="cs-confidence__head">
        <span>{lbl}</span>
        <span className="cs-confidence__level" style={{ color: meta.color }}>{levelText}</span>
      </div>
      <div className="cs-confidence__track" role="meter" aria-valuemin={0} aria-valuemax={segs} aria-valuenow={filled} aria-label={lbl + ": " + levelText}>
        {Array.from({ length: segs }).map((_, i) => (
          <span key={i} className="cs-confidence__seg" style={i < filled ? { background: meta.color } : undefined} />
        ))}
      </div>
    </div>
  );
}
