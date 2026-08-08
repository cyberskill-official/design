import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer } from "./OverlayManager.jsx";

/** CyberSkill Drawer — slide-in side panel with scrim. side: right (default) | left. */
export function Drawer({ open, onClose, title, side = "right", children, actions, lang, className }) {
  const [ref, L] = useLang(lang);
  const panel = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;

  useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel,
  });

  const t = makeT("Drawer", L);
  if (!open) return null;
  return (
    <>
      <div className="cs-drawer-scrim" onClick={onClose} aria-hidden="true" />
      <aside
        ref={(el) => {
          panel.current = el;
          ref.current = el;
        }}
        tabIndex={-1}
        className={cx("cs-drawer", side === "left" && "cs-drawer--left", className)}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : t("panel")}
      >
        <div className="cs-drawer__header">
          {title ? <h2 className="cs-drawer__title">{title}</h2> : null}
          <button type="button" className="cs-drawer__close" aria-label={t("close")} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="cs-drawer__body" tabIndex={0}>{children}</div>
        {actions ? <div className="cs-drawer__footer">{actions}</div> : null}
      </aside>
    </>
  );
}
