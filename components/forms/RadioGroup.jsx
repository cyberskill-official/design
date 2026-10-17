import React from "react";
import { cx } from "../_utils/cx.js";

/** A single labelled radio (brand accent-color). Usually composed via RadioGroup. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export function Radio({ label, description, disabled = false, className, children, ...props }) {
  return (
    <label className={cx("cs-radio", disabled && "is-disabled", className)}>
      <input type="radio" disabled={disabled} {...props} />
      <span className="cs-radio__text">
        <span>{label}</span>
        {(description || description === 0) ? <span className="cs-radio__desc">{description}</span> : null}
      </span>
    </label>
  );
}

/** CyberSkill RadioGroup — a fieldset of radios from `options`, controlled by value/onChange. */
export function RadioGroup({ legend, name, value, onChange, options = [], className }) {
  const gid = React.useId();
  const nm = name ?? gid;
  return (
    <fieldset className={cx("cs-radio-group", className)}>
      {(legend || legend === 0) ? <legend>{legend}</legend> : null}
      {options.map((o) => (
        <Radio key={o.value} name={nm} value={o.value} label={o.label} description={o.description}
          disabled={o.disabled} checked={value === o.value}
          onChange={() => onChange && onChange(o.value)} />
      ))}
    </fieldset>
  );
}
