import { Button as BaseButton } from '@base-ui/react/button';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'quiet' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<BaseButton.Props, 'className'> & {
  className?: string;
  /** Visual style. `accent` (gold) is for one key action or AI moment per view. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the button focusable and announces it as busy. */
  loading?: boolean;
  /** Icon before the label (decorative). */
  iconStart?: ReactNode;
  /** Icon after the label (decorative). */
  iconEnd?: ReactNode;
  /** Stretch to the container width. */
  fullWidth?: boolean;
};

export function Button({ variant = 'primary', size = 'md', loading = false, iconStart, iconEnd, fullWidth, className, children, disabled, ...props }: ButtonProps) {
  return (
    <BaseButton
      {...props}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      className={cx('cs-button', className)}
    >
      {loading ? <span className="cs-button-spinner" aria-hidden="true" /> : iconStart && <span className="cs-button-icon" aria-hidden="true">{iconStart}</span>}
      {children != null && <span className="cs-button-label">{children}</span>}
      {iconEnd && <span className="cs-button-icon" aria-hidden="true">{iconEnd}</span>}
    </BaseButton>
  );
}

export type IconButtonProps = Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd' | 'fullWidth'> & {
  /** Accessible name, read by screen readers and shown as the tooltip-free label. Required. */
  label: string;
  icon: ReactNode;
};

/** Square button with only an icon. `label` becomes its accessible name. */
export function IconButton({ label, icon, variant = 'secondary', className, ...props }: IconButtonProps) {
  // children={undefined}: a parent's `render` (e.g. `<ToolbarButton render={<IconButton … />} />`) passes its own children; only the icon shows
  return <Button {...props} variant={variant} aria-label={label} iconStart={icon} data-icon-only="" className={cx('cs-icon-button', className)} children={undefined} />;
}

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; label?: string };

/** Joins related buttons into one control. Give it a `label` when the group has no visible heading. */
export function ButtonGroup({ className, label, ...props }: ButtonGroupProps) {
  return <div role="group" aria-label={label} {...props} className={cx('cs-button-group', className)} />;
}
