import React from "react";
import { useOverlayLayer, overlayScopeContext } from "./OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill Popover — anchored floating panel. Uncontrolled (click toggles) or controlled. */
export function Popover({ trigger, children, align = "start", open: controlled, onOpenChange, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }) {
  const [u, setU] = React.useState(false);
  const open = controlled != null ? controlled : u;
  const set = (v) => { if (controlled == null) setU(v); onOpenChange?.(v); };
  const ref = React.useRef(null);
  const { scope } = useOverlayLayer({ open, kind: "popover", panelRef: ref, onEscape: () => set(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (ref.current && !ref.current.contains(e.target)) set(false); };
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
    <span className={cx("cs-popover", className)} ref={ref}>
      {triggerNode}
      {open ? <div className={cx("cs-popover__panel", align === "end" && "cs-popover__panel--end")} role="dialog" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>{children}</div> : null}
    </span>
    </overlayScopeContext.Provider>
  );
}
