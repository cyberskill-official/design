import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const STAR = "M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z";

/** CyberSkill Rating — whole-star rating (APG radiogroup: roving tabindex + arrows). Controlled or uncontrolled; readOnly for display. Click the current value to clear. */
export function Rating({ value, defaultValue = 0, onChange, max = 5, readOnly = false, label, lang, className }) {
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const commit = (n) => { if (readOnly) return; if (value == null) setInner(n); onChange && onChange(n); };
  const set = (n) => commit(n === val ? 0 : n);
  const [ref, L] = useLang(lang);
  const lbl = label != null ? label : makeT("Rating", L)("label");
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
    <div ref={ref} className={cx("cs-rating", className)} role="radiogroup" aria-label={lbl + ": " + val + " / " + max} data-readonly={readOnly ? "true" : undefined}>
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={i < val}
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
  );
}
