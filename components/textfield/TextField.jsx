import React from "react";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill TextField — label + input with optional description and error.
 * Programmatic label association and aria-describedby wiring; IME-safe.
 */
export function TextField({
  id,
  label,
  description,
  error,
  disabled = false,
  readOnly = false,
  className,
  children, // never rendered on purpose: keeps stray children out of {...props} → void <input>
  ...props
}) {
  const hasError = Boolean(error) || error === 0;
  const hasDescription = Boolean(description) || description === 0;
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = hasDescription ? `${inputId}-description` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const describedBy = [props["aria-describedby"], descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label
      className={cx("cs-field", disabled && "is-disabled", hasError && "is-invalid", className)}
      htmlFor={inputId}
    >
      <span className="cs-field__label">{label}</span>
      {hasDescription ? <span id={descriptionId} className="cs-field__description">{description}</span> : null}
      <input
        {...props}
        id={inputId}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={hasError ? true : props["aria-invalid"]}
        aria-describedby={describedBy}
        className="cs-field__control"
      />
      {hasError ? <span id={errorId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
}
