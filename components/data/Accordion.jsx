import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Accordion — collapsible sections. Single-open by default; allowMultiple for many. */
export const Accordion = React.forwardRef(function Accordion({ items = [], defaultOpen = 0, allowMultiple = false, className , rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const id = React.useId();
  const [open, setOpen] = React.useState(() => (defaultOpen != null && defaultOpen >= 0 ? [defaultOpen] : []));
  React.useEffect(() => {
    if (!allowMultiple) setOpen(current => current.length > 1 ? current.slice(0, 1) : current);
  }, [allowMultiple]);
  const isOpen = (i) => (allowMultiple ? open.includes(i) : open[0] === i);
  const toggle = (i) => {
    if (allowMultiple) setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
    else setOpen((o) => (o[0] === i ? [] : [i]));
  };
  return (
    <div {...mergeTargetProps({ "className": cx("cs-accordion", className) }, rootProps, [])} ref={mergedNativeRef} >
      {items.map((it, i) => (
        <div className="cs-accordion__item" key={i}>
          <h3 style={{ margin: 0, font: "inherit" }}>
          <button id={`${id}-trigger-${i}`} type="button" className="cs-accordion__trigger" aria-expanded={isOpen(i)} aria-controls={isOpen(i) ? `${id}-panel-${i}` : undefined} onClick={() => toggle(i)}>
            {it.title}
            <span className="cs-accordion__chevron" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></span>
          </button>
          </h3>
          {isOpen(i) ? <div id={`${id}-panel-${i}`} aria-labelledby={`${id}-trigger-${i}`} className="cs-accordion__panel">{it.content}</div> : null}
        </div>
      ))}
    </div>
  );
});
Accordion.displayName = "Accordion";
