import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Toggle — a single pressable on/off button (≠ Switch: no form semantics; ≠ SegmentedControl: standalone). */
export const Toggle = React.forwardRef(function Toggle({ pressed, defaultPressed = false, onChange, onClick, icon, children, disabled = false, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [inner, setInner] = React.useState(defaultPressed);
  const on = pressed != null ? pressed : inner;
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Toggle", L, localeMessages);
  const hasContent = React.Children.toArray(children).some(child => typeof child !== "string" || child.trim().length > 0);
  const flip = () => { const v = !on; if (pressed == null) setInner(v); onChange && onChange(v); };
  return (
    <button
      ref={mergedNativeRef}
      type="button"
      className={cx("cs-toggle", className)}
      aria-pressed={on}
      aria-label={ariaLabel ?? (hasContent ? undefined : t("label"))}
      disabled={disabled}
      onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) flip(); }}
      {...props}
    >
      {(icon || icon === 0) ? <span aria-hidden="true" style={{ display: "inline-flex" }}>{icon}</span> : null}
      {children}
    </button>
  );
});
Toggle.displayName = "Toggle";
