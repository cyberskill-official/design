import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { useFieldAssociation, mergeTargetProps, fieldMessages } from "../_utils/field-association.js";

import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { renderCount } from "../_utils/renderCount.js";
const STAR = "M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z";

/** CyberSkill Rating — whole-star rating (APG radiogroup: roving tabindex + arrows). Controlled or uncontrolled; readOnly for display. Click the current value to clear. */
export const Rating = React.forwardRef(function Rating({ value, defaultValue = 0, onChange, max: requestedMax = 5, readOnly = false, label, lang, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const max = renderCount(requestedMax, 5);
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const commit = (n) => { if (readOnly) return; if (value == null) setInner(n); onChange && onChange(n); };
  const set = (n) => commit(n === val ? 0 : n);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("Rating", L, localeMessages)("label");
  // Both bags address the semantic group; owned digit/radio props stay on items.
  const group = mergeTargetProps(mergeTargetProps({}, rootProps, ["role", "name", "value", "required"]), controlProps, ["role", "name", "value", "required"]);
  const requiredDescription = undefined;
  const control = useFieldAssociation({ id: group.id ?? id, "aria-label": group["aria-label"] ?? (group["aria-labelledby"] ? undefined : (label ? label + ": " + val + " / " + max : undefined)),
    "aria-labelledby": group["aria-labelledby"], "aria-describedby": group["aria-describedby"],
    "aria-invalid": group["aria-invalid"], "aria-required": group["aria-required"] },
    { fallbackLabel: lbl + ": " + val + " / " + max, description, error, required, requiredSupported: true, requiredDescription });
  const refs = React.useRef([]);
  const focusIdx = val > 0 ? Math.min(max, val) - 1 : 0;

  const move = (from, delta) => {
    if (readOnly) return;
    const next = Math.max(0, Math.min(max - 1, from + delta));
    commit(next + 1);
    const b = refs.current[next];
    if (b) b.focus();
  };

  const onKeyDown = (e, i) => {
    if (readOnly || e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); move(i, 1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); move(i, -1); }
    else if (e.key === "Home") { e.preventDefault(); move(i, -i); }
    else if (e.key === "End") { e.preventDefault(); move(i, max - 1 - i); }
  };

  return (
    <React.Fragment>
    <div {...group} {...control} ref={mergedNativeRef} className={cx("cs-rating", className, group.className)} role="radiogroup" data-readonly={readOnly ? "true" : undefined}>
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={i + 1 === val}
          aria-label={(i + 1) + " / " + max}
          className={i < val ? "on" : undefined}
          onClick={() => set(i + 1)}
          tabIndex={readOnly ? -1 : (i === focusIdx ? 0 : -1)}
          ref={(el) => { refs.current[i] = el; }}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={i < val ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d={STAR} /></svg>
        </button>
      ))}
    </div>
    {fieldMessages(control, description, error, requiredDescription)}
    </React.Fragment>
  );
});
Rating.displayName = "Rating";
