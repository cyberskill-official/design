import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { renderCount } from "../_utils/renderCount.js";

/** CyberSkill InputOTP — one-time-code boxes: auto-advance, backspace, paste. Digits only. */
export function InputOTP({ length: requestedLength = 6, value, onChange, onComplete, label, lang, disabled = false, className }) {
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
  const [ref, L] = useLang(lang);
  const lbl = label != null ? label : makeT("InputOTP", L)("label");
  return (
    <div ref={ref} className={cx("cs-otp", className)} role="group" aria-label={lbl}>
      {Array.from({ length }).map((_, i) => (
        <input key={i} ref={(el) => (boxes.current[i] = el)} inputMode="numeric" pattern="[0-9]*" maxLength={1} disabled={disabled}
          value={val[i] || ""} aria-label={lbl + " " + (i + 1) + "/" + length}
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
      ))}
    </div>
  );
}
