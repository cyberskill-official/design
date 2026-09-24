import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Textarea — multi-line input in the .cs-field frame; label/description/error. */
export const Textarea = React.forwardRef(function Textarea({ id, label, description, error, disabled = false, rows = 4, className, ...props }, forwardedRef) {
  const gid = React.useId();
  const tid = id ?? gid;
  const descId = description ? tid + "-desc" : undefined;
  const errId = error ? tid + "-err" : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <label ref={forwardedRef} className={cx("cs-field", disabled && "is-disabled", error && "is-invalid", className)} htmlFor={tid}>
      {label ? <span className="cs-field__label">{label}</span> : null}
      {description ? <span id={descId} className="cs-field__description">{description}</span> : null}
      <textarea {...props} id={tid} rows={rows} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className="cs-field__control" />
      {error ? <span id={errId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
});
