import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill EmptyState — friendly placeholder for empty views. */
export function EmptyState({ icon, title, children, actions, lang, className }) {
  const [ref, L] = useLang(lang);
  const t = makeT("EmptyState", L);
  return (
    <div ref={ref} className={cx("cs-empty", className)}>
      <span className="cs-empty__icon">
        {icon ?? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6" /></svg>}
      </span>
      <div className="cs-empty__title">{title ?? t("title")}</div>
      {children ? <div className="cs-empty__body">{children}</div> : null}
      {actions ? <div className="cs-empty__actions">{actions}</div> : null}
    </div>
  );
}
