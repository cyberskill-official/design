import { mergeIds } from "../_utils/field-association.js";
import { useComposedRefs } from "../_utils/refs.js";
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
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const hasError = Boolean(error) || error === 0;
  const hasDescription = Boolean(description) || description === 0;
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const hasLabel = Boolean(label) || label === 0;
  const labelId = hasLabel ? inputId + "-label" : undefined;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : undefined);
  const descriptionId = hasDescription ? `${inputId}-description` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const describedBy = mergeIds(props["aria-describedby"], descriptionId, errorId);

  return (
    <label
      className={cx("cs-field", disabled && "is-disabled", hasError && "is-invalid", className)}
      htmlFor={inputId}
    >
      <span id={labelId} className="cs-field__label">{label}</span>
      {hasDescription ? <span id={descriptionId} className="cs-field__description">{description}</span> : null}
      <input
        {...props}
        id={inputId}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={hasError ? true : props["aria-invalid"]}
        aria-labelledby={labelledBy} aria-describedby={describedBy}
        className="cs-field__control"
       ref={mergedNativeRef} />
      {hasError ? <span id={errorId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
});
TextField.displayName = "TextField";
