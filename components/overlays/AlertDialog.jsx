import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { overlaySurfaceClass, useOverlaySurface } from "../_utils/use-overlay-surface.js";
import { useOverlayLayer, overlayScopeContext } from "./OverlayManager.jsx";

/**
 * CyberSkill AlertDialog — first-class destructive/confirm modal (role=alertdialog).
 * Distinct from Popconfirm (inline bubble) and Dialog (general modal). Focus trap +
 * restore via overlay manager; bilingual confirm/cancel via the registry.
 */
export const AlertDialog = React.forwardRef(function AlertDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  tone,
  variant,
  onConfirm,
  onCancel,
  lang,
  className,
  ...props
}, forwardedRef) {
  const baseId = React.useId();
  const titleId = baseId + "-title";
  const descId = baseId + "-desc";
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("AlertDialog", L, localeMessages);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, forwardedRef);
  const backdrop = React.useRef(null);
  const uncontrolled = open === undefined;
  const [internal, setInternal] = React.useState(!!defaultOpen);
  const isOpen = uncontrolled ? internal : !!open;
  const material = overlaySurfaceClass(className);
  const surface = useOverlaySurface(isOpen, panel, material);
  const setOpen = (next) => {
    if (uncontrolled) setInternal(next);
    onOpenChange?.(next);
  };
  const destructive = (tone ?? variant) === "destructive";
  const confirmRef = React.useRef(onConfirm);
  confirmRef.current = onConfirm;
  const cancelRef = React.useRef(onCancel);
  cancelRef.current = onCancel;
  const setOpenRef = React.useRef(setOpen);
  setOpenRef.current = setOpen;

  const { scope } = useOverlayLayer({
    open: isOpen,
    kind: "modal",
    trapFocus: true,
    preferFocusSelector: destructive ? ".cs-alert-dialog__cancel" : ".cs-alert-dialog__confirm",
    onEscape: () => {
      setOpenRef.current(false);
      cancelRef.current?.();
    },
    panelRef: panel,
    backdropRef: backdrop,
  });

  const cl = cancelLabel != null ? cancelLabel : t("cancel");
  const cf = confirmLabel != null ? confirmLabel : t("confirm");
  const body = description ?? children;
  const hasDesc = body != null && body !== false && body !== "";

  if (!isOpen) return null;
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={ref} className="cs-dialog-layer cs-alert-dialog-layer">
      <div
        ref={backdrop} className="cs-dialog__overlay"
        onClick={() => { setOpen(false); cancelRef.current?.(); }}
        aria-hidden="true"
      />
      {material ? <div ref={surface} className={cx("cs-overlay-surface", material)} aria-hidden="true" /> : null}
      <section
        {...props}
        ref={mergedNativeRef}
        data-cs-overlay-material={material || undefined}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hasDesc ? descId : undefined}
        className={cx("cs-dialog", "cs-alert-dialog", destructive && "cs-alert-dialog--destructive", className)}
      >
        <header className="cs-dialog__header">
          <h2 id={titleId} className="cs-dialog__title">{title}</h2>
        </header>
        {hasDesc ? <div id={descId} className="cs-dialog__body">{body}</div> : null}
        <footer className="cs-dialog__actions">
          <button
            type="button"
            className="cs-button cs-button--ghost cs-button--md cs-alert-dialog__cancel"
            onClick={() => { setOpen(false); cancelRef.current?.(); }}
          >
            {cl}
          </button>
          <button
            type="button"
            className={cx(
              "cs-button",
              "cs-button--md",
              "cs-alert-dialog__confirm",
              destructive ? "cs-button--danger" : "cs-button--primary"
            )}
            onClick={() => { setOpen(false); confirmRef.current?.(); }}
          >
            {cf}
          </button>
        </footer>
      </section>
    </div>
    </overlayScopeContext.Provider>
  );
});
AlertDialog.displayName = "AlertDialog";
