import { useComposedRefs } from "../_utils/refs.js";
import { mergeIds, mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** A single labelled radio (brand accent-color). Usually composed via RadioGroup. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export const Radio = React.forwardRef(function Radio({ label, description, disabled = false, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const generatedId = React.useId();
  const hasLabel = Boolean(label) || label === 0;
  const hasDescription = Boolean(description) || description === 0;
  const labelId = hasLabel ? generatedId + "-label" : undefined;
  const descriptionId = hasDescription ? generatedId + "-description" : undefined;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : undefined);
  const describedBy = mergeIds(props["aria-describedby"], descriptionId);
  return (
    <label className={cx("cs-radio", disabled && "is-disabled", className)}>
      <input type="radio" disabled={disabled} {...props} aria-labelledby={labelledBy} aria-describedby={describedBy} ref={mergedNativeRef} />
      <span className="cs-radio__text">
        <span id={labelId}>{label}</span>
        {(description || description === 0) ? <span id={descriptionId} className="cs-radio__desc">{description}</span> : null}
      </span>
    </label>
  );
});
Radio.displayName = "Radio";

/** CyberSkill RadioGroup — a fieldset of radios from `options`, controlled by value/onChange. */
export const RadioGroup = React.forwardRef(function RadioGroup({ legend, name, value, onChange, options = [], className , rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const gid = React.useId();
  const nm = name ?? gid;
  return (
    <fieldset {...mergeTargetProps({ "className": cx("cs-radio-group", className) }, rootProps, [])} ref={mergedNativeRef} >
      {(legend || legend === 0) ? <legend>{legend}</legend> : null}
      {options.map((o) => (
        <Radio key={o.value} name={nm} value={o.value} label={o.label} description={o.description}
          disabled={o.disabled} checked={value === o.value}
          onChange={() => onChange && onChange(o.value)} />
      ))}
    </fieldset>
  );
});
RadioGroup.displayName = "RadioGroup";
