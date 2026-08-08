import React from "react";
import { cx } from "../_utils/cx.js";

let warnedNameless = false;

/** CyberSkill Switch — accessible toggle (role="switch"); Umber on, Ochre knob-track in dark. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export function Switch({ label, disabled = false, className, children, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...props }) {
  const named = !!(label || ariaLabel || ariaLabelledby);
  if (!named && !warnedNameless && typeof console !== "undefined" && console.warn) {
    warnedNameless = true;
    console.warn("CyberSkill Switch: render with label, aria-label, or aria-labelledby.");
  }
  return (
    <label className={cx("cs-switch", disabled && "is-disabled", className)}>
      <input
        type="checkbox"
        role="switch"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        {...props}
      />
      <span className="cs-switch__track" aria-hidden="true" />
      {label ? <span className="cs-switch__label">{label}</span> : null}
    </label>
  );
}
