import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Accordion — collapsible sections. Single-open by default; allowMultiple for many. */
export const Accordion = React.forwardRef(function Accordion({ items = [], defaultOpen = 0, allowMultiple = false, className }, forwardedRef) {
  const [open, setOpen] = React.useState(() => (allowMultiple ? (defaultOpen != null ? [defaultOpen] : []) : defaultOpen));
  const isOpen = (i) => (allowMultiple ? open.includes(i) : open === i);
  const toggle = (i) => {
    if (allowMultiple) setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
    else setOpen((o) => (o === i ? -1 : i));
  };
  return (
    <div ref={forwardedRef} className={cx("cs-accordion", className)}>
      {items.map((it, i) => (
        <div className="cs-accordion__item" key={i}>
          <button type="button" className="cs-accordion__trigger" aria-expanded={isOpen(i)} onClick={() => toggle(i)}>
            {it.title}
            <span className="cs-accordion__chevron" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></span>
          </button>
          {isOpen(i) ? <div className="cs-accordion__panel">{it.content}</div> : null}
        </div>
      ))}
    </div>
  );
});
