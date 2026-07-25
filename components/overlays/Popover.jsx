import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Popover — anchored floating panel. Uncontrolled (click toggles) or controlled. */
export function Popover({ trigger, children, align = "start", open: controlled, onOpenChange, className }) {
  const [u, setU] = React.useState(false);
  const open = controlled != null ? controlled : u;
  const set = (v) => (onOpenChange ? onOpenChange(v) : setU(v));
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (ref.current && !ref.current.contains(e.target)) set(false); };
    const k = (e) => { if (e.key === "Escape") set(false); };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  const toggle = () => set(!open);
  // ARIA attrs must live on the interactive trigger (button), not a wrapping <span>
  // — axe aria-allowed-attr flags aria-haspopup/aria-expanded on generic elements.
  const triggerNode = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: (e) => {
          if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
          if (!e.defaultPrevented) toggle();
        },
      })
    : <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={toggle}>{trigger}</button>;
  return (
    <span className={cx("cs-popover", className)} ref={ref}>
      {triggerNode}
      {open ? <div className={cx("cs-popover__panel", align === "end" && "cs-popover__panel--end")} role="dialog">{children}</div> : null}
    </span>
  );
}
