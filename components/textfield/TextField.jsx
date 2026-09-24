import React from "react";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill TextField — label + input with optional description and error.
 * Programmatic label association and aria-describedby wiring; IME-safe.
 */
export const TextField = React.forwardRef(function TextField({
  id,
  label,
  description,
  error,
  disabled = false,
  readOnly = false,
  className,
  children, // never rendered on purpose: keeps stray children out of {...props} → void <input>
  ...props
}, forwardedRef) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label ref={forwardedRef}
      className={cx("cs-field", disabled && "is-disabled", error && "is-invalid", className)}
      htmlFor={inputId}
    >
      <span className="cs-field__label">{label}</span>
      {description ? <span id={descriptionId} className="cs-field__description">{description}</span> : null}
      <input
        {...props}
        id={inputId}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="cs-field__control"
      />
      {error ? <span id={errorId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
});
