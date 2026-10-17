import React from "react";
import { useOverlayLayer, overlayScopeContext, focusableSelector } from "./OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill HoverCard — hover/focus-triggered rich preview panel (delayed open/close). */
export function HoverCard({ trigger, children, openDelay = 150, closeDelay = 200, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }) {
  const [open, setOpen] = React.useState(false);
  const panel = React.useRef(null);
  const timer = React.useRef();
  const hovered = React.useRef(false);
  const focused = React.useRef(false);
  const triggerFocus = React.useRef(null);
  const sync = () => {
    clearTimeout(timer.current);
    const next = hovered.current || focused.current;
    timer.current = setTimeout(() => setOpen(next), next ? openDelay : closeDelay);
  };
  const dismiss = () => {
    clearTimeout(timer.current);
    const content = panel.current?.querySelector(':scope > .cs-hovercard__panel');
    if (content?.contains(document.activeElement)) {
      const targets = [...panel.current.querySelectorAll(focusableSelector)].filter(el =>
        !content.contains(el) && el.tabIndex >= 0 && !el.disabled &&
        !el.closest('[inert], [hidden], [aria-hidden="true"]') &&
        el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden");
      const target = targets.includes(triggerFocus.current) ? triggerFocus.current : targets[0];
      // Focus before removing content: this stays within the wrapper and does not
      // schedule another open through its focus-entry handler.
      target?.focus();
    }
    clearTimeout(timer.current);
    setOpen(false);
  };
  const { scope } = useOverlayLayer({ open, kind: "popover", panelRef: panel, restoreFocus: false, onEscape: dismiss });
  React.useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={panel} className={cx("cs-hovercard", className)} onMouseEnter={() => { hovered.current = true; sync(); }}
      onMouseLeave={() => { hovered.current = false; if (!focused.current) sync(); }}
      onFocus={(e) => {
        if (!e.currentTarget.querySelector(':scope > .cs-hovercard__panel')?.contains(e.target)) triggerFocus.current = e.target;
        if (!e.currentTarget.contains(e.relatedTarget)) { focused.current = true; sync(); }
      }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { focused.current = false; if (!hovered.current) sync(); } }}>
      {trigger}
      {open ? <span className="cs-hovercard__panel" role="dialog" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>{children}</span> : null}
    </span>
    </overlayScopeContext.Provider>
  );
}
