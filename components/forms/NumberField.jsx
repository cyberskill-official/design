import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useFieldAssociation, mergeTargetProps, fieldMessages } from "../_utils/field-association.js";

/** CyberSkill NumberField — numeric stepper with −/+ buttons and clamping. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export const NumberField = React.forwardRef(function NumberField({
  id,
  label,
  value,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  lang,
  className,
  children,
  rootProps,
  controlProps,
  description,
  error,
  required = false,
  ...props
}, forwardedRef) {
  const [inner, setInner] = React.useState(() => defaultValue);
  const inputRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(inputRef, forwardedRef);
  const val = value != null ? value : inner;
  const clamp = (n) => {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return n;
  };
  const set = (n) => {
    const c = clamp(n);
    if (value == null) setInner(c);
    onChange?.(c);
  };
  const stepBy = (direction) => {
    const input = inputRef.current;
    if (!input) return;
    // Delegate decimal arithmetic and step-base alignment to the same native
    // control. A detached copy keeps controlled DOM ownership with the caller.
    const probe = input.cloneNode(false);
    probe.value = input.value;
    probe.stepUp(direction);
    if (Number.isFinite(probe.valueAsNumber)) set(probe.valueAsNumber);
  };
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("NumberField", L, localeMessages);
  const control = useFieldAssociation(mergeTargetProps({ ...props, id: controlProps?.id ?? id, type: "number", value: val, min, max, step, disabled,
    "aria-label": props["aria-label"] ?? label,
    onChange: e => { const raw = e.target.value; if (raw === "") { if (value == null) setInner(""); return; } const num = Number(raw); if (Number.isFinite(num)) set(num); },
    onBlur: e => { if (inner === "" && value == null) setInner(clamp(0)); props.onBlur?.(e); },
  }, controlProps, ["role", "type", "value", "defaultValue", "onChange", "min", "max", "step", "disabled"]), { id: controlProps?.id ?? id, fallbackLabel: label ? undefined : t("value"), nativeRequired: true, description, error, required });
  return (
    <div {...mergeTargetProps({ className: cx("cs-field", disabled && "is-disabled", className) }, rootProps)} ref={ref}>
      {label ? (
        <label className="cs-field__label" htmlFor={control.id}>
          {label}
        </label>
      ) : null}
      <div className="cs-stepper">
        <button type="button" aria-label={t("decrease")} disabled={disabled || (min != null && val !== "" && val <= min)} onClick={() => stepBy(-1)}>
          −
        </button>
        <input {...control} ref={mergedNativeRef} />
        <button type="button" aria-label={t("increase")} disabled={disabled || (max != null && val !== "" && val >= max)} onClick={() => stepBy(1)}>
          +
        </button>
      </div>
      {fieldMessages(control, description, error)}
    </div>
  );
});
NumberField.displayName = "NumberField";
