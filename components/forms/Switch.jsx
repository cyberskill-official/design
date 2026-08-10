import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Switch — accessible toggle (role="switch"); Umber on, Ochre knob-track in dark. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export function Switch({ label, disabled = false, className, children, lang, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...props }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Switch", L);
  const named = !!(label || ariaLabel || ariaLabelledby);
  const fallback = props.checked || props.defaultChecked ? t("on") : t("off");
  return (
    <label ref={ref} className={cx("cs-switch", disabled && "is-disabled", className)}>
      <input
        type="checkbox"
        role="switch"
        disabled={disabled}
        aria-label={ariaLabel ?? (named ? undefined : fallback)}
        aria-labelledby={ariaLabelledby}
        {...props}
      />
      <span className="cs-switch__track" aria-hidden="true" />
      {label ? <span className="cs-switch__label">{label}</span> : null}
    </label>
  );
}
