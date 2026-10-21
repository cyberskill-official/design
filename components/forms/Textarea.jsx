import { mergeIds } from "../_utils/field-association.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Textarea — multi-line input in the .cs-field frame; label/description/error. */
export const Textarea = React.forwardRef(function Textarea({ id, label, description, error, disabled = false, rows = 4, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const hasError = Boolean(error) || error === 0;
  const hasDescription = Boolean(description) || description === 0;
  const gid = React.useId();
  const tid = id ?? gid;
  const hasLabel = Boolean(label) || label === 0;
  const labelId = hasLabel ? tid + "-label" : undefined;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : undefined);
  const descId = hasDescription ? tid + "-desc" : undefined;
  const errId = hasError ? tid + "-err" : undefined;
  const describedBy = mergeIds(props["aria-describedby"], descId, errId);
  return (
    <label className={cx("cs-field", disabled && "is-disabled", hasError && "is-invalid", className)} htmlFor={tid}>
      {(label || label === 0) ? <span id={labelId} className="cs-field__label">{label}</span> : null}
      {hasDescription ? <span id={descId} className="cs-field__description">{description}</span> : null}
      <textarea {...props} id={tid} rows={rows} disabled={disabled} aria-invalid={hasError ? true : props["aria-invalid"]} aria-labelledby={labelledBy} aria-describedby={describedBy} className="cs-field__control"  ref={mergedNativeRef} />
      {hasError ? <span id={errId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
});
Textarea.displayName = "Textarea";
