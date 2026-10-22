import { mergeIds } from "../_utils/field-association.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Checkbox — native checkbox (brand accent-color) + label/description. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export const Checkbox = React.forwardRef(function Checkbox({ label, description, disabled = false, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const generatedId = React.useId();
  const hasLabel = Boolean(label) || label === 0;
  const hasDescription = Boolean(description) || description === 0;
  const labelId = hasLabel ? generatedId + "-label" : undefined;
  const descriptionId = hasDescription ? generatedId + "-description" : undefined;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : undefined);
  const describedBy = mergeIds(props["aria-describedby"], descriptionId);
  return (
    <label className={cx("cs-check", disabled && "is-disabled", className)}>
      <input type="checkbox" disabled={disabled} {...props} aria-labelledby={labelledBy} aria-describedby={describedBy} ref={mergedNativeRef} />
      <span className="cs-check__text">
        <span id={labelId}>{label}</span>
        {(description || description === 0) ? <span id={descriptionId} className="cs-check__desc">{description}</span> : null}
      </span>
    </label>
  );
});
Checkbox.displayName = "Checkbox";
