import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill SegmentedControl — pill toggle group (single select). Matches the Status Hub lens switcher. */
export function SegmentedControl({ options = [], value, onChange, className, ...props }) {
  const refs = React.useRef([]);
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const vertical = props["aria-orientation"] === "vertical";
  const key = (e, i) => {
    let n = null;
    if (e.key === (vertical ? "ArrowDown" : "ArrowRight")) n = (i + 1) % options.length;
    else if (e.key === (vertical ? "ArrowUp" : "ArrowLeft")) n = (i - 1 + options.length) % options.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = options.length - 1;
    if (n == null) return;
    e.preventDefault();
    if (onChange) onChange(options[n].value);
    const b = refs.current[n]; if (b) b.focus();
  };
  return (
    <div role="tablist" className={cx("cs-segmented", className)} {...props}>
      {options.map((o, i) => (
        <button key={o.value} type="button" role="tab" id={o.id} aria-controls={o["aria-controls"]} aria-selected={value === o.value}
          tabIndex={i === idx ? 0 : -1} ref={(el) => (refs.current[i] = el)} onKeyDown={(e) => key(e, i)}
          onClick={() => onChange && onChange(o.value)}>
          {(o.icon || o.icon === 0) ? <span aria-hidden="true">{o.icon}</span> : null}
          {o.label}
        </button>
      ))}
    </div>
  );
}
