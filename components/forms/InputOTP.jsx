import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { useFieldAssociation, mergeTargetProps, fieldMessages } from "../_utils/field-association.js";

import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { renderCount } from "../_utils/renderCount.js";

/** CyberSkill InputOTP — one-time-code boxes: auto-advance, backspace, paste. Digits only. */
export const InputOTP = React.forwardRef(function InputOTP({ length: requestedLength = 6, value, onChange, onComplete, label, lang, disabled = false, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const length = renderCount(requestedLength, 6);
  const [inner, setInner] = React.useState("");
  const val = (value != null ? value : inner).slice(0, length);
  const boxes = React.useRef([]);
  const set = (v) => {
    if (disabled) return;
    v = v.replace(/\D/g, "").slice(0, length);
    if (value == null) setInner(v);
    onChange && onChange(v);
    if (v.length === length && onComplete) onComplete(v);
  };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("InputOTP", L, localeMessages)("label");
  // Both bags address the semantic group; owned digit/radio props stay on items.
  const group = mergeTargetProps(mergeTargetProps({}, rootProps, ["role", "name", "value", "required", "aria-required"]), controlProps, ["role", "name", "value", "required", "aria-required"]);
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : undefined;
  const control = useFieldAssociation({ id: group.id ?? id, "aria-label": group["aria-label"] ?? (group["aria-labelledby"] ? undefined : (label)),
    "aria-labelledby": group["aria-labelledby"], "aria-describedby": group["aria-describedby"],
    "aria-invalid": group["aria-invalid"] },
    { fallbackLabel: lbl, description, error, required, requiredSupported: false, requiredDescription });
  return (
    <React.Fragment>
    <div {...group} {...control} ref={mergedNativeRef} className={cx("cs-otp", className, group.className)} role="group">
      {Array.from({ length }).map((_, i) => (
        <React.Fragment key={i}>
        <span id={control.id + "-digit-" + (i + 1)} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>{(i + 1) + "/" + length}</span>
        <input aria-labelledby={control["aria-labelledby"] ? control["aria-labelledby"] + " " + control.id + "-digit-" + (i + 1) : undefined} id={control.id + "-" + (i + 1)} aria-describedby={control["aria-describedby"]} aria-invalid={control["aria-invalid"]} ref={(el) => (boxes.current[i] = el)} inputMode="numeric" pattern="[0-9]*" maxLength={1} disabled={disabled}
          value={val[i] || ""} aria-label={(control["aria-label"] || lbl) + " " + (i + 1) + "/" + length}
          onChange={(e) => {
            // Native Delete/cut/clear produces an empty input, unlike invalid text.
            if (e.target.value === "") { set(val.slice(0, i) + val.slice(i + 1)); return; }
            const c = e.target.value.replace(/\D/g, "");
            if (!c) return;
            set(val.slice(0, i) + c + val.slice(i + 1));
            const nb = boxes.current[i + 1]; if (nb) nb.focus();
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229 || e.key !== "Backspace") return;
            e.preventDefault();
            const arr = val.split("");
            if (arr[i]) arr.splice(i, 1); else if (i > 0) arr.splice(i - 1, 1);
            set(arr.join(""));
            const pb = boxes.current[Math.max(0, i - 1)]; if (pb) pb.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const p = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, length);
            set(p);
            const nb = boxes.current[Math.min(length - 1, p.length)]; if (nb) nb.focus();
          }}
        />
        </React.Fragment>
      ))}
    </div>
    {fieldMessages(control, description, error, requiredDescription)}
    </React.Fragment>
  );
});
InputOTP.displayName = "InputOTP";
