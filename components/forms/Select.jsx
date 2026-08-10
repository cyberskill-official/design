import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Select — native <select> in the .cs-field frame with a chevron.
 *  Pass `options` [{value,label}] or <option> children. */
export function Select({ id, label, description, error, options, children, disabled = false, lang, className, placeholder, ...props }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Select", L);
  const gid = React.useId();
  const sid = id ?? gid;
  const descId = description ? sid + "-desc" : undefined;
  const errId = error ? sid + "-err" : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <label ref={ref} className={cx("cs-field", disabled && "is-disabled", error && "is-invalid", className)} htmlFor={sid}>
      {label ? <span className="cs-field__label">{label}</span> : null}
      {description ? <span id={descId} className="cs-field__description">{description}</span> : null}
      <span className="cs-select">
        <select {...props} id={sid} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className="cs-field__control">
          {placeholder != null || !children ? <option value="" disabled hidden>{placeholder ?? t("placeholder")}</option> : null}
          {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
        </select>
        <span className="cs-select__chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </span>
      {error ? <span id={errId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
}
