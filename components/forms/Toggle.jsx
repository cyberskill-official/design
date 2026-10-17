import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Toggle — a single pressable on/off button (≠ Switch: no form semantics; ≠ SegmentedControl: standalone). */
export function Toggle({ pressed, defaultPressed = false, onChange, onClick, icon, children, disabled = false, lang, className, "aria-label": ariaLabel, ...props }) {
  const [inner, setInner] = React.useState(defaultPressed);
  const on = pressed != null ? pressed : inner;
  const [ref, L] = useLang(lang);
  const t = makeT("Toggle", L);
  const hasContent = React.Children.toArray(children).some(child => typeof child !== "string" || child.trim().length > 0);
  const flip = () => { const v = !on; if (pressed == null) setInner(v); onChange && onChange(v); };
  return (
    <button
      ref={ref}
      type="button"
      className={cx("cs-toggle", className)}
      aria-pressed={on}
      aria-label={ariaLabel ?? (hasContent ? undefined : (on ? t("pressed") : t("unpressed")))}
      disabled={disabled}
      onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) flip(); }}
      {...props}
    >
      {(icon || icon === 0) ? <span aria-hidden="true" style={{ display: "inline-flex" }}>{icon}</span> : null}
      {children}
    </button>
  );
}
