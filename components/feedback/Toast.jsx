import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** Variant glyphs — aligned with Alert so status is never colour-alone (FIND-036). */
const PATHS = {
  default: "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  success: "M4 12.5l5 5 11-11",
  danger: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6",
};
function DefaultIcon({ variant }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[variant] || PATHS.default} />
    </svg>
  );
}

/** Fixed-position stack for Toasts (bottom-right). */
export function ToastStack({ children, lang, className }) {
  const [ref, L] = useLang(lang);
  return <div ref={ref} className={cx("cs-toast-stack", className)} role="region" aria-label={makeT("Toast", L)("notifications")}>{children}</div>;
}

/** CyberSkill Toast — transient notification. variant: default | success | danger. */
export function Toast({ variant = "default", title, icon, onClose, lang, children, className, ...props }) {
  const [ref, L] = useLang(lang);
  return (
    <div ref={ref} className={cx("cs-toast", `cs-toast--${variant}`, className)} role="status" {...props}>
      <span className="cs-toast__icon" aria-hidden="true">
        {icon ?? <DefaultIcon variant={variant} />}
      </span>
      <div>
        {title ? <div className="cs-toast__title">{title}</div> : null}
        {children ? <div className="cs-toast__body">{children}</div> : null}
      </div>
      {onClose ? (
        <button type="button" className="cs-toast__close" aria-label={makeT("Toast", L)("dismiss")} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      ) : null}
    </div>
  );
}
