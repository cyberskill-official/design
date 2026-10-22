import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill HumanReviewGate — an AI-native checkpoint: a risk label, a
 * plain-language summary, an optional reviewer, and Approve / Reject actions.
 * Renders review controls and invokes caller callbacks. The consumer owns
 * reviewer authorization, recorded approval and execution of the action.
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
 rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("HumanReviewGate", L, localeMessages);
  const rk = risk != null ? risk : t("risk");
  const al = approveLabel != null ? approveLabel : t("approve");
  const rl = rejectLabel != null ? rejectLabel : t("reject");
  return (
    <section ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-review-gate", className) }, rootProps, ["aria-label"])} aria-label={t("aria")}>
      <div className="cs-review-gate__risk">{rk}</div>
      <p className="cs-review-gate__summary">{summary}</p>
      {(reviewer || reviewer === 0) ? <p className="cs-review-gate__reviewer">{t("reviewer")}: {reviewer}</p> : null}
      <div className="cs-review-gate__actions">
        <button type="button" className="cs-button cs-button--secondary" onClick={onReject}>{rl}</button>
        <button type="button" className="cs-button cs-button--primary" onClick={onApprove}>{al}</button>
      </div>
    </section>
  );
});
HumanReviewGate.displayName = "HumanReviewGate";
