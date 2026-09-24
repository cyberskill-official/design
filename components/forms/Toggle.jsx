import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Toggle — a single pressable on/off button (≠ Switch: no form semantics; ≠ SegmentedControl: standalone). */
export const Toggle = React.forwardRef(function Toggle({ pressed, defaultPressed = false, onChange, icon, children, disabled = false, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [inner, setInner] = React.useState(defaultPressed);
  const on = pressed != null ? pressed : inner;
  const [ref, L] = useLang(lang);
  const t = makeT("Toggle", L);
  const flip = () => { const v = !on; if (pressed == null) setInner(v); onChange && onChange(v); };
  return (
    <button
      ref={mergeRefs(ref, forwardedRef)}
      type="button"
      className={cx("cs-toggle", className)}
      aria-pressed={on}
      aria-label={ariaLabel ?? (on ? t("pressed") : t("unpressed"))}
      disabled={disabled}
      onClick={flip}
      {...props}
    >
      {icon ? <span aria-hidden="true" style={{ display: "inline-flex" }}>{icon}</span> : null}
      {children}
    </button>
  );
});
