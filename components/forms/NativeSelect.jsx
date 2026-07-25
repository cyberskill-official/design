import React from "react";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill NativeSelect — progressive-enhancement native <select> styled to
 * CS tokens beside Select. Leaner field chrome (size + label + error); pass
 * `options` [{value,label}] (preferred) or <option> children.
 */
export function NativeSelect({
  id,
  label,
  error,
  options,
  children,
  disabled = false,
  size = "md",
  className,
  value,
  defaultValue,
  onChange,
  ...props
}) {
  const gid = React.useId();
  const sid = id ?? gid;
  const errId = error ? sid + "-err" : undefined;
  return (
    <label className={cx("cs-field", "cs-native-select-field", disabled && "is-disabled", error && "is-invalid", className)} htmlFor={sid}>
      {label ? <span className="cs-field__label">{label}</span> : null}
      <span className={cx("cs-native-select", `cs-native-select--${size}`)}>
        <select
          {...props}
          id={sid}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={errId}
          className="cs-field__control"
        >
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        <span className="cs-native-select__chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </span>
      {error ? <span id={errId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
}
