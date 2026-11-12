import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type ToggleProps = Omit<BaseToggle.Props, 'className'> & {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Icon before the text (decorative). */
  icon?: ReactNode;
  /** Icon shown instead of `icon` while pressed, e.g. a filled star. */
  pressedIcon?: ReactNode;
  /** Accessible name for an icon-only toggle (no children). Required then. */
  label?: string;
};

/** A button that stays on or off, e.g. Bold or Favorite. Announced as a pressed / not pressed button. */
export function Toggle({ size = 'md', icon, pressedIcon, label, className, children, ...props }: ToggleProps) {
  const iconOnly = children == null;
  return (
    <BaseToggle aria-label={iconOnly ? label : undefined} {...props} data-size={size} data-icon-only={iconOnly || undefined} className={cx('cs-toggle', className)}>
      {icon != null && (
        <span className="cs-toggle-icon" data-swap={pressedIcon != null || undefined} aria-hidden="true">
          {icon}
        </span>
      )}
      {pressedIcon != null && (
        <span className="cs-toggle-icon" data-pressed-icon="" aria-hidden="true">
          {pressedIcon}
        </span>
      )}
      {!iconOnly && <span className="cs-toggle-label">{children}</span>}
    </BaseToggle>
  );
}
