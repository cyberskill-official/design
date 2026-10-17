import React from "react";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill Button. Umber primary by default; warm hover; composite focus indicator (text-primary contour + Ochre halo);
 * 44px comfortable touch target. Renders a real <button>.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  children,
  className,
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cx(
        "cs-button",
        `cs-button--${variant}`,
        `cs-button--${size}`,
        fullWidth && "cs-button--full",
        isDisabled && "is-disabled",
        loading && "is-loading",
        className
      )}
    >
      {(icon || icon === 0) ? <span className="cs-button__icon" aria-hidden="true">{icon}</span> : null}
      <span className="cs-button__label">{children}</span>
      {loading ? <span className="cs-button__spinner" aria-hidden="true" /> : null}
    </button>
  );
}
