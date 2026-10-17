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
  const inputRef = React.useRef(null);
  const val = value != null ? value : inner;
  const clamp = (n) => {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return n;
  };
  const set = (n) => {
    const c = clamp(n);
    if (value == null) setInner(c);
    onChange?.(c);
  };
  const stepBy = (direction) => {
    const input = inputRef.current;
    if (!input) return;
    // Delegate decimal arithmetic and step-base alignment to the same native
    // control. A detached copy keeps controlled DOM ownership with the caller.
    const probe = input.cloneNode(false);
    probe.value = input.value;
    probe.stepUp(direction);
    if (Number.isFinite(probe.valueAsNumber)) set(probe.valueAsNumber);
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
        <button type="button" aria-label={t("decrease")} disabled={disabled || (min != null && val <= min)} onClick={() => stepBy(-1)}>
          −
        </button>
        <input
          {...props}
          ref={inputRef}
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
        <button type="button" aria-label={t("increase")} disabled={disabled || (max != null && val >= max)} onClick={() => stepBy(1)}>
          +
        </button>
      </div>
    </div>
  );
}
