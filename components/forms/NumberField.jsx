import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill NumberField — numeric stepper with −/+ buttons and clamping. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  lang,
  className,
  children,
  ...props
}) {
  const [inner, setInner] = React.useState(0);
  const val = value != null ? value : inner;
  const clamp = (n) => {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return n;
  };
  const set = (n) => {
    const c = clamp(n);
    onChange ? onChange(c) : setInner(c);
  };
  const [ref, L] = useLang(lang);
  const t = makeT("NumberField", L);
  const gid = React.useId();
  const sid = id ?? gid;
  return (
    <div ref={ref} className={cx("cs-field", disabled && "is-disabled", className)}>
      {label ? (
        <label className="cs-field__label" htmlFor={sid}>
          {label}
        </label>
      ) : null}
      <div className="cs-stepper">
        <button type="button" aria-label={t("decrease")} disabled={disabled || (min != null && val <= min)} onClick={() => set(val - step)}>
          −
        </button>
        <input
          {...props}
          id={sid}
          type="number"
          value={val}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-label={label ? undefined : t("value")}
          onChange={(e) => set(Number(e.target.value))}
        />
        <button type="button" aria-label={t("increase")} disabled={disabled || (max != null && val >= max)} onClick={() => set(val + step)}>
          +
        </button>
      </div>
    </div>
  );
}
