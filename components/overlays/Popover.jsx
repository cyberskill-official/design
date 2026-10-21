import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { useOverlayLayer, overlayScopeContext } from "./OverlayManager.jsx";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Popover — anchored floating panel. Uncontrolled (click toggles) or controlled. */
export const Popover = React.forwardRef(function Popover({ portal = true, placement, trigger, children, align = "start", open: controlled, onOpenChange, className, rootProps, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(floatingRef, forwardedRef);
  const [u, setU] = React.useState(false);
  const open = controlled != null ? controlled : u;
  const set = (v) => { if (controlled == null) setU(v); onOpenChange?.(v); };
  const [ref, L, localeMessages] = useLang();
  const t = makeT("Popover", L, localeMessages);
  const floating = useFloatingPanel({ open: open, anchorRef: ref, panelRef: floatingRef, portal, placement: placement ?? (align === "end" ? "bottom-end" : "bottom-start"), gap: 8, getAnchor: ()=>ref.current?.querySelector('[aria-haspopup="dialog"]') });
  const { scope } = useOverlayLayer({ open: (open) && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => set(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (!floating.contains(e.target)) set(false); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  const toggle = (event) => {
    // Pointer activation does not focus buttons in every browser. Establish
    // the opener before the layer records its return-focus target.
    if (!open) event.currentTarget.focus();
    set(!open);
  };
  // ARIA attrs must live on the interactive trigger (button), not a wrapping <span>
  // — axe aria-allowed-attr flags aria-haspopup/aria-expanded on generic elements.
  const triggerNode = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: (e) => {
          if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
          if (!e.defaultPrevented) toggle(e);
        },
      })
    : <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={toggle}>{trigger}</button>;
  return (
    <overlayScopeContext.Provider value={scope}>
    <span {...mergeTargetProps({ className: cx("cs-popover", className) }, rootProps)} ref={ref}>
      {triggerNode}
      {open ? floating.render(<div className={cx("cs-popover__panel", align === "end" && "cs-popover__panel--end")} role="dialog" aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : t("panel"))} aria-labelledby={ariaLabelledBy} ref={mergedNativeRef} >{children}</div>) : null}
    </span>
    </overlayScopeContext.Provider>
  );
});
Popover.displayName = "Popover";
