import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useClientLayoutEffect } from "../_utils/use-client-layout-effect.js";
import { cx } from "../_utils/cx.js";
import { overlaySurfaceClass, useOverlaySurface } from "../_utils/use-overlay-surface.js";
import { useOverlayLayer, overlayScopeContext } from "./OverlayManager.jsx";
import { notifyClosed } from "../_utils/open-change.js";

/** CyberSkill Drawer — slide-in side panel with scrim. side: right (default) | left. */
export const Drawer = React.forwardRef(function Drawer({ open, onClose, onOpenChange, title, side = "right", children, actions, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const titleId = React.useId();
  const hasTitle = Boolean(title) || title === 0;
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, ref, forwardedRef);
  const body = React.useRef(null);
  const [bodyScrollable, setBodyScrollable] = React.useState(false);
  const backdrop = React.useRef(null);
  const material = overlaySurfaceClass(className);
  const surface = useOverlaySurface(!!open, panel, material);
  // Surface readiness must precede the first layout read; otherwise measuring
  // overflow can start an unready backdrop-filter transition in nested modals.
  useClientLayoutEffect(() => {
    const el = body.current;
    if (!open || !el) return;
    const measure = () => setBodyScrollable(el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [open, children]);
  const closeRef = React.useRef(null);
  closeRef.current = () => notifyClosed(onOpenChange, onClose);

  const { scope } = useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel,
    backdropRef: backdrop,
  });

  const t = makeT("Drawer", L, localeMessages);
  if (!open) return null;
  return (
    <overlayScopeContext.Provider value={scope}>
    <>
      <div ref={backdrop} className="cs-drawer-scrim" onClick={() => closeRef.current()} aria-hidden="true" />
      {material ? <div ref={surface} className={cx("cs-overlay-surface", material)} aria-hidden="true" /> : null}
      <div
        {...mergeTargetProps({ className: cx("cs-drawer", side === "left" && "cs-drawer--left", className) }, rootProps, ["role", "tabIndex", "aria-modal", "aria-labelledby", "aria-label", "data-cs-overlay-material"])}
        ref={mergedNativeRef}
        data-cs-overlay-material={material || undefined}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-label={hasTitle ? undefined : t("panel")}
      >
        <div className="cs-drawer__header">
          {hasTitle ? <h2 id={titleId} className="cs-drawer__title">{title}</h2> : null}
          <button type="button" className="cs-drawer__close" aria-label={t("close")} onClick={() => closeRef.current()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div ref={body} className="cs-drawer__body" tabIndex={bodyScrollable ? 0 : undefined}>{children}</div>
        {(actions || actions === 0) ? <div className="cs-drawer__footer">{actions}</div> : null}
      </div>
    </>
    </overlayScopeContext.Provider>
  );
});
Drawer.displayName = "Drawer";
