import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill HumanReviewGate — an AI-native checkpoint: a risk label, a
 * plain-language summary, an optional reviewer, and Approve / Reject actions.
 * Keeps a human in the loop before a high-stakes AI action proceeds.
 */
export const HumanReviewGate = React.forwardRef(function HumanReviewGate({
  risk,
  summary,
  reviewer,
  onApprove,
  onReject,
  approveLabel,
  rejectLabel,
  lang,
  className,
}, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("HumanReviewGate", L);
  const rk = risk != null ? risk : t("risk");
  const al = approveLabel != null ? approveLabel : t("approve");
  const rl = rejectLabel != null ? rejectLabel : t("reject");
  return (
    <section ref={mergeRefs(ref, forwardedRef)} className={cx("cs-review-gate", className)} aria-label={t("aria")}>
      <div className="cs-review-gate__risk">{rk}</div>
      <p className="cs-review-gate__summary">{summary}</p>
      {reviewer ? <p className="cs-review-gate__reviewer">{t("reviewer")}: {reviewer}</p> : null}
      <div className="cs-review-gate__actions">
        <button type="button" className="cs-button cs-button--secondary" onClick={onReject}>{rl}</button>
        <button type="button" className="cs-button cs-button--primary" onClick={onApprove}>{al}</button>
      </div>
    </section>
  );
});
