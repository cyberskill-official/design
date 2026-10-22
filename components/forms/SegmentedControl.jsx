import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill SegmentedControl — pill toggle group (single select). Matches the Status Hub lens switcher. */
export const SegmentedControl = React.forwardRef(function SegmentedControl({ options = [], value, onChange, mode, role, className, ...props }, forwardedRef) {
  if (role !== undefined && role !== "tablist" && role !== "radiogroup") throw new TypeError("Unsupported SegmentedControl role: " + role);
  // The deprecated semantic alias only selects a mode when mode is omitted.
  const effectiveMode = mode === undefined ? (role === "tablist" ? "tabs" : "radio") : mode;
  if (effectiveMode !== "radio" && effectiveMode !== "tabs") throw new TypeError("Unsupported SegmentedControl mode: " + effectiveMode);
  const tabs = effectiveMode === "tabs";
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const refs = React.useRef([]);
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const vertical = props["aria-orientation"] === "vertical";
  const key = (e, i) => {
    if (e.defaultPrevented || e.isComposing || e.nativeEvent?.isComposing || e.keyCode === 229) return;
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
    <div {...props} role={tabs ? "tablist" : "radiogroup"} aria-orientation={vertical ? "vertical" : "horizontal"} className={cx("cs-segmented", className)} ref={mergedNativeRef} >
      {options.map((o, i) => (
        <button key={o.value} type="button" role={tabs ? "tab" : "radio"} id={o.id} aria-controls={o["aria-controls"]} aria-selected={tabs ? value === o.value : undefined} aria-checked={tabs ? undefined : value === o.value}
          tabIndex={i === idx ? 0 : -1} ref={(el) => (refs.current[i] = el)} onKeyDown={(e) => key(e, i)}
          onClick={() => onChange && onChange(o.value)}>
          {(o.icon || o.icon === 0) ? <span aria-hidden="true">{o.icon}</span> : null}
          {o.label}
        </button>
      ))}
    </div>
  );
});
SegmentedControl.displayName = "SegmentedControl";
