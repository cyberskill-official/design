import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Icon } from "../icon/Icon.jsx";
import { cx } from "../_utils/cx.js";
import { overlaySurfaceClass, useOverlaySurface } from "../_utils/use-overlay-surface.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";

/**
 * CyberSkill Dialog — modal overlay + panel. aria-modal, labelled by title and
 * described by its body, scrim click closes. Body scroll is locked while open
 * via the overlay manager (nested-safe). Compose actions in the footer with Buttons.
 */
export const Dialog = React.forwardRef(function Dialog({
  open,
  title,
  children,
  actions,
  onClose,
  className,
  closeLabel,
  lang,
  ...props
}, forwardedRef) {
  const baseId = React.useId();
  const titleId = baseId + "-title";
  const bodyId = children == null ? undefined : baseId + "-body";
  const [ref, L, localeMessages] = useLang(lang);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, forwardedRef);
  const backdrop = React.useRef(null);
  const material = overlaySurfaceClass(className);
  const surface = useOverlaySurface(!!open, panel, material);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;

  const { scope } = useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel,
    backdropRef: backdrop,
  });

  const cl = closeLabel != null ? closeLabel : makeT("Dialog", L, localeMessages)("close");
  if (!open) return null;
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={ref} className="cs-dialog-layer">
      <div ref={backdrop} className="cs-dialog__overlay" onClick={onClose} aria-hidden="true" />
      {material ? <div ref={surface} className={cx("cs-overlay-surface", material)} aria-hidden="true" /> : null}
      <section
        {...props}
        ref={mergedNativeRef}
        data-cs-overlay-material={material || undefined}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={Object.prototype.hasOwnProperty.call(props, "aria-describedby") ? (props["aria-describedby"] || undefined) : bodyId}
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
        {(actions || actions === 0) ? <footer className="cs-dialog__actions">{actions}</footer> : null}
      </section>
    </div>
    </overlayScopeContext.Provider>
  );
});
Dialog.displayName = "Dialog";
