import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill HoverCard — hover/focus-triggered rich preview panel (delayed open/close). */
export const HoverCard = React.forwardRef(function HoverCard({ trigger, children, openDelay = 150, closeDelay = 200, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const t1 = React.useRef(); const t2 = React.useRef();
  const show = () => { clearTimeout(t2.current); t1.current = setTimeout(() => setOpen(true), openDelay); };
  const hide = () => { clearTimeout(t1.current); t2.current = setTimeout(() => setOpen(false), closeDelay); };
  React.useEffect(() => () => { clearTimeout(t1.current); clearTimeout(t2.current); }, []);
  return (
    <span ref={forwardedRef} className={cx("cs-hovercard", className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {trigger}
      {open ? <span className="cs-hovercard__panel" role="dialog">{children}</span> : null}
    </span>
  );
});
