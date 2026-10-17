import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Checkbox — native checkbox (brand accent-color) + label/description. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export function Checkbox({ label, description, disabled = false, className, children, ...props }) {
  return (
    <label className={cx("cs-check", disabled && "is-disabled", className)}>
      <input type="checkbox" disabled={disabled} {...props} />
      <span className="cs-check__text">
        <span>{label}</span>
        {(description || description === 0) ? <span className="cs-check__desc">{description}</span> : null}
      </span>
    </label>
  );
}
