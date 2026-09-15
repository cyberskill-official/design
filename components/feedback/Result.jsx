import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const ART = {
  success: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-11" /></svg>,
  error: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>,
  warning: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18.2v.1" /></svg>,
  info: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.2v.1" /></svg>,
};

/** CyberSkill Result — full status view (success/error/warning/info): icon, title, body, actions. */
export const Result = React.forwardRef(function Result({ status = "info", title, children, actions, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Result", L);
  const tt = title != null ? title : t(status);
  return (
    <div ref={mergeRefs(ref, forwardedRef)} className={cx("cs-result", "cs-result--" + status, className)} role="status">
      <span className="cs-result__icon" aria-hidden="true">{ART[status] || ART.info}</span>
      <h2 className="cs-result__title">{tt}</h2>
      {children ? <div className="cs-result__body">{children}</div> : null}
      {actions ? <div className="cs-result__actions">{actions}</div> : null}
    </div>
  );
});
