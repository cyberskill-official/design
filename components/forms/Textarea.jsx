import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Textarea — multi-line input in the .cs-field frame; label/description/error. */
export function Textarea({ id, label, description, error, disabled = false, rows = 4, className, ...props }) {
  const hasError = Boolean(error) || error === 0;
  const hasDescription = Boolean(description) || description === 0;
  const gid = React.useId();
  const tid = id ?? gid;
  const descId = hasDescription ? tid + "-desc" : undefined;
  const errId = hasError ? tid + "-err" : undefined;
  const describedBy = [props["aria-describedby"], descId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <label className={cx("cs-field", disabled && "is-disabled", hasError && "is-invalid", className)} htmlFor={tid}>
      {(label || label === 0) ? <span className="cs-field__label">{label}</span> : null}
      {hasDescription ? <span id={descId} className="cs-field__description">{description}</span> : null}
      <textarea {...props} id={tid} rows={rows} disabled={disabled} aria-invalid={hasError ? true : props["aria-invalid"]} aria-describedby={describedBy} className="cs-field__control" />
      {hasError ? <span id={errId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
}
