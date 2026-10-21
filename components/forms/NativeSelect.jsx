import { mergeIds } from "../_utils/field-association.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill NativeSelect — progressive-enhancement native <select> styled to
 * CS tokens beside Select. Leaner field chrome (size + label + error); pass
 * `options` [{value,label}] (preferred) or <option> children.
 */
export const NativeSelect = React.forwardRef(function NativeSelect({
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
}, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const hasError = Boolean(error) || error === 0;
  const gid = React.useId();
  const sid = id ?? gid;
  const hasLabel = Boolean(label) || label === 0;
  const labelId = hasLabel ? sid + "-label" : undefined;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : undefined);
  const errId = hasError ? sid + "-err" : undefined;
  const describedBy = mergeIds(props["aria-describedby"], errId);
  return (
    <label className={cx("cs-field", "cs-native-select-field", disabled && "is-disabled", hasError && "is-invalid", className)} htmlFor={sid}>
      {(label || label === 0) ? <span id={labelId} className="cs-field__label">{label}</span> : null}
      <span className={cx("cs-native-select", `cs-native-select--${size}`)}>
        <select
          {...props}
          id={sid}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={hasError ? true : props["aria-invalid"]}
          aria-labelledby={labelledBy} aria-describedby={describedBy}
          className="cs-field__control"
         ref={mergedNativeRef} >
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
      {hasError ? <span id={errId} className="cs-field__error" role="alert">{error}</span> : null}
    </label>
  );
});
NativeSelect.displayName = "NativeSelect";
