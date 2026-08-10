import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

const PATHS = {
  info: "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  success: "M4 12.5l5 5 11-11",
  warning: "M12 3l9 16H3z M12 10v4 M12 17h.01",
  danger: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6",
};
function DefaultIcon({ variant }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[variant] || PATHS.info} />
    </svg>
  );
}

/** CyberSkill Alert — inline banner. variant: info | success | warning | danger. */
export function Alert({ variant = "info", title, icon, children, onDismiss, lang, className, ...props }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Alert", L);
  return (
    <div ref={ref} role="status" className={cx("cs-alert", `cs-alert--${variant}`, className)} {...props}>
      <span className="cs-alert__icon">{icon ?? <DefaultIcon variant={variant} />}</span>
      <div>
        {title ? <p className="cs-alert__title">{title}</p> : null}
        {children ? <div className="cs-alert__body">{children}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" className="cs-alert__dismiss" aria-label={t("dismiss")} onClick={onDismiss}>×</button>
      ) : null}
    </div>
  );
}
