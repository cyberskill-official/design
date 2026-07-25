import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Menu — dropdown. Provide a `trigger` element; compose MenuItem children. */
export function Menu({ trigger, children, align = "start", open: controlledOpen, onOpenChange, className }) {
  const [uOpen, setUOpen] = React.useState(false);
  const open = controlledOpen != null ? controlledOpen : uOpen;
  const set = (v) => { onOpenChange ? onOpenChange(v) : setUOpen(v); };
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) set(false); };
    const onKey = (e) => { if (e.key === "Escape") set(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const toggle = () => set(!open);
  // ARIA attrs must live on the interactive trigger (button), not a wrapping <span>
  // — axe aria-allowed-attr flags aria-haspopup/aria-expanded on generic elements.
  const triggerNode = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        "aria-haspopup": "menu",
        "aria-expanded": open,
        onClick: (e) => {
          if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
          if (!e.defaultPrevented) toggle();
        },
      })
    : <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={toggle}>{trigger}</button>;
  return (
    <div className={cx("cs-menu", className)} ref={ref}>
      {triggerNode}
      {open ? (
        <div className={cx("cs-menu__list", align === "end" && "cs-menu__list--end")} role="menu">{children}</div>
      ) : null}
    </div>
  );
}

/** An item inside a Menu. */
export function MenuItem({ danger = false, icon, children, className, ...props }) {
  return (
    <button type="button" role="menuitem" className={cx("cs-menu__item", danger && "cs-menu__item--danger", className)} {...props}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </button>
  );
}
