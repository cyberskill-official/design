import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Switch — accessible toggle (role="switch"); Umber on, Ochre knob-track in dark. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export const Switch = React.forwardRef(function Switch({ label, disabled = false, className, children, lang, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Switch", L, localeMessages);
  const hasLabel = Boolean(label) || label === 0;
  const named = !!(hasLabel || ariaLabel || ariaLabelledby);
  const fallback = t("label");
  const { onChange, ...rest } = props;
  return (
    <label ref={ref} className={cx("cs-switch", disabled && "is-disabled", className)}>
      <input
        type="checkbox"
        role="switch"
        disabled={disabled}
        aria-label={ariaLabel ?? (named ? undefined : fallback)}
        aria-labelledby={ariaLabelledby}
        onChange={(e) => {
          if (onChange) onChange(e);
        }}
        {...rest}
       ref={mergedNativeRef} />
      <span className="cs-switch__track" aria-hidden="true" />
      {hasLabel ? <span className="cs-switch__label">{label}</span> : null}
    </label>
  );
});
Switch.displayName = "Switch";
