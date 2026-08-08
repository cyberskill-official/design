import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Icon } from "../icon/Icon.jsx";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer } from "../overlays/OverlayManager.jsx";

/**
 * CyberSkill Dialog — modal overlay + panel. aria-modal, labelled by title and
 * described by its body, scrim click closes. Body scroll is locked while open
 * via the overlay manager (nested-safe). Compose actions in the footer with Buttons.
 */
export function Dialog({
  open,
  title,
  children,
  actions,
  onClose,
  className,
  closeLabel,
  lang,
  ...props
}) {
  const baseId = React.useId();
  const titleId = baseId + "-title";
  const bodyId = children == null ? undefined : baseId + "-body";
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

  const cl = closeLabel != null ? closeLabel : makeT("Dialog", L)("close");
  if (!open) return null;
  return (
    <div ref={ref} className="cs-dialog-layer">
      <div className="cs-dialog__overlay" onClick={onClose} aria-hidden="true" />
      <section
        {...props}
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId != null ? bodyId : props["aria-describedby"]}
        className={cx("cs-dialog", className)}
      >
        <header className="cs-dialog__header">
          <h2 id={titleId} className="cs-dialog__title">{title}</h2>
          {onClose ? (
            <button type="button" className="cs-button cs-button--ghost cs-button--sm" onClick={onClose} aria-label={cl}>
              <Icon name="close" size="sm" />
            </button>
          ) : null}
        </header>
        <div id={bodyId} className="cs-dialog__body">{children}</div>
        {actions ? <footer className="cs-dialog__actions">{actions}</footer> : null}
      </section>
    </div>
  );
}
