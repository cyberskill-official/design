import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
import { hasDismiss, notifyClosed } from "../_utils/open-change.js";

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
export const ToastStack = React.forwardRef(function ToastStack({ children, lang, className , rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  return <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-toast-stack", className) }, rootProps, ["role","aria-label"])} role="region" aria-label={makeT("Toast", L, localeMessages)("notifications")}>{children}</div>;
});
ToastStack.displayName = "ToastStack";

/** CyberSkill Toast — transient notification. variant: default | success | danger. */
export const Toast = React.forwardRef(function Toast({ variant = "default", title, icon, onClose, onOpenChange, lang, children, className, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const { scope } = useOverlayLayer({ open: true, kind: "toast", panelRef: ref, restoreFocus: false });
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={mergedNativeRef} className={cx("cs-toast", `cs-toast--${variant}`, className)} role="status" {...props}>
      <span className="cs-toast__icon" aria-hidden="true">
        {icon ?? <DefaultIcon variant={variant} />}
      </span>
      <div>
        {(title || title === 0) ? <div className="cs-toast__title">{title}</div> : null}
        {(children || children === 0) ? <div className="cs-toast__body">{children}</div> : null}
      </div>
      {hasDismiss(onOpenChange, onClose) ? (
        <button type="button" className="cs-toast__close" aria-label={makeT("Toast", L, localeMessages)("dismiss")} onClick={() => notifyClosed(onOpenChange, onClose)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      ) : null}
    </div>
    </overlayScopeContext.Provider>
  );
});
Toast.displayName = "Toast";
