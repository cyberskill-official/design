import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { useFieldAssociation, mergeTargetProps, fieldMessages } from "../_utils/field-association.js";

import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill TagInput — multi-value token input. Enter/comma adds, Backspace removes last, blur commits. */
export const TagInput = React.forwardRef(function TagInput({ controlRef,
  id,
  label,
  value,
  defaultValue = [],
  onChange,
  placeholder,
  max,
  disabled = false,
  lang,
  className, description, error, required = false, rootProps, controlProps,
}, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const [inner, setInner] = React.useState(defaultValue);
  const tags = value != null ? value : inner;
  const [q, setQ] = React.useState("");
  const set = (arr) => {
    if (disabled) return;
    if (value == null) setInner(arr);
    onChange && onChange(arr);
  };
  const add = (s) => {
    if (disabled) return;
    s = s.trim();
    if (!s) return;
    if (tags.includes(s)) {
      setQ("");
      return;
    }
    if (max != null && tags.length >= max) return;
    set([...tags, s]);
    setQ("");
  };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("TagInput", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const control = useFieldAssociation({ id: controlProps?.id ?? id, "aria-label": controlProps?.["aria-label"],
    "aria-labelledby": controlProps?.["aria-labelledby"],
    "aria-describedby": controlProps?.["aria-describedby"], "aria-invalid": controlProps?.["aria-invalid"],
    "aria-required": controlProps?.["aria-required"] },
    { fallbackLabel: label ? undefined : ph, description, error, required, requiredSupported: true });
  const sid = control.id;
  if (label && !controlProps?.["aria-labelledby"] && !controlProps?.["aria-label"]) control["aria-labelledby"] = sid + "-label";
  return (
    <div ref={mergedNativeRef} {...mergeTargetProps({ className: cx("cs-field", disabled && "is-disabled", className) }, rootProps)}>
      {label ? <label id={sid + "-label"} className="cs-field__label" htmlFor={sid}>{label}</label> : null}
      <div className="cs-taginput">
        {tags.map((tag) => (
          <span key={tag} className="cs-tag">
            {tag}
            <button
              type="button"
              className="cs-tag__close"
              aria-label={t("remove") + " " + tag}
              onClick={() => set(tags.filter((x) => x !== tag))}
              disabled={disabled}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>
        ))}
        <input {...mergeTargetProps({ ...control, value: q, placeholder: tags.length ? "" : ph, disabled, onChange: (e) => setQ(e.target.value), onKeyDown: (e) => {
            if (disabled || e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(q);
            } else if (e.key === "Backspace" && !q && tags.length) {
              set(tags.slice(0, -1));
            }
          }, onBlur: () => add(q) }, controlProps, ["id", "role", "type", "name", "value", "defaultValue", "disabled", "required", "aria-required", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-haspopup", "aria-expanded", "aria-controls", "aria-activedescendant", "onChange"])}  ref={mergedControlRef} />
      </div>
      {fieldMessages(control, description, error)}
    </div>
  );
});
TagInput.displayName = "TagInput";
