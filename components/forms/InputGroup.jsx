import { mergeIds } from "../_utils/field-association.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const EYE = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
const EYE_OFF = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/></svg>;
const X = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>;

/** CyberSkill InputGroup — input with prefix/suffix addons, clearable ×, and password reveal. */
export const InputGroup = React.forwardRef(function InputGroup({
  id,
  label,
  prefix,
  suffix,
  clearable = false,
  password = false,
  value,
  onChange,
  defaultValue = "",
  placeholder,
  disabled = false,
  readOnly = false,
  lang,
  className,
  ...props
}, forwardedRef) {
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const set = (v) => { if (disabled || readOnly) return; if (value == null) setInner(v); onChange && onChange(v); };
  const [show, setShow] = React.useState(false);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("InputGroup", L, localeMessages);
  const gid = React.useId();
  const sid = id ?? gid;
  const hasLabel = Boolean(label) || label === 0;
  const labelId = hasLabel ? sid + "-label" : undefined;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : undefined);
  return (
    <div ref={mergedNativeRef} className={cx("cs-field", disabled && "is-disabled", className)}>
      {hasLabel ? <label id={labelId} className="cs-field__label" htmlFor={sid}>{label}</label> : null}
      <span className="cs-igroup">
        {prefix != null ? <span className="cs-igroup__fix">{prefix}</span> : null}
        <input
          {...props}
          id={sid}
          type={password && !show ? "password" : "text"}
          value={val}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-labelledby={labelledBy}
          aria-describedby={mergeIds(props["aria-describedby"])}
          aria-label={props["aria-label"] ?? (hasLabel || props["aria-labelledby"] != null ? undefined : (placeholder || t("input")))}
          onChange={(e) => set(e.target.value)}
        />
        {clearable && String(val).length ? <button type="button" className="cs-igroup__btn" aria-label={t("clear")} disabled={disabled || readOnly} onClick={() => set("")}>{X}</button> : null}
        {password ? <button type="button" className="cs-igroup__btn" aria-label={show ? t("hide") : t("show")} aria-pressed={show} disabled={disabled} onClick={() => setShow((s) => !s)}>{show ? EYE_OFF : EYE}</button> : null}
        {suffix != null ? <span className="cs-igroup__fix cs-igroup__fix--suffix">{suffix}</span> : null}
      </span>
    </div>
  );
});
InputGroup.displayName = "InputGroup";
