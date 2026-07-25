import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Collapsible — single expand panel without Accordion chrome. */
export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  trigger,
  children,
  className,
  ...props
}) {
  const uncontrolled = open === undefined;
  const [internal, setInternal] = React.useState(!!defaultOpen);
  const isOpen = uncontrolled ? internal : !!open;
  const setOpen = (next) => {
    if (uncontrolled) setInternal(next);
    onOpenChange?.(next);
  };
  const label = title ?? trigger;
  const panelId = React.useId();
  const triggerId = React.useId();
  return (
    <div className={cx("cs-collapsible", className)} {...props}>
      <button
        type="button"
        id={triggerId}
        className="cs-collapsible__trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpen(!isOpen)}
      >
        <span className="cs-collapsible__label">{label}</span>
        <span className="cs-collapsible__chevron" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {isOpen ? (
        <div id={panelId} role="region" aria-labelledby={triggerId} className="cs-collapsible__panel">
          {children}
        </div>
      ) : null}
    </div>
  );
}
