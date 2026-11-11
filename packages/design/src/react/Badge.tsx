import { CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../utils/cx';

export type BadgeTone = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeVariant = 'soft' | 'solid' | 'outline';

// Status tones always carry an icon: their meaning never rests on color alone.
const STATUS_ICONS: Partial<Record<BadgeTone, ReactNode>> = {
  success: <CheckCircle />,
  warning: <Warning />,
  danger: <XCircle />,
  info: <Info />,
};

export type BadgeProps = ComponentProps<'span'> & {
  /** Color meaning. `success`, `warning`, `danger` and `info` show a status icon by default. */
  tone?: BadgeTone;
  /** `soft` tinted (default), `solid` filled, `outline` bordered. */
  variant?: BadgeVariant;
  /** `sm` 20px, `md` 24px tall. */
  size?: 'sm' | 'md';
  /** Decorative icon before the text. Replaces a status tone's icon; `false` removes the icon on non-status tones only. */
  icon?: ReactNode | false;
};

/** Short status or count label. Not interactive; use a Button or Tag for anything clickable. */
export function Badge({ tone = 'neutral', variant = 'soft', size = 'md', icon, className, children, ...props }: BadgeProps) {
  const glyph = (icon !== false && icon) || STATUS_ICONS[tone];
  return (
    <span {...props} data-tone={tone} data-variant={variant} data-size={size} className={cx('cs-badge', className)}>
      {glyph && <span className="cs-badge-icon" aria-hidden="true">{glyph}</span>}
      {children}
    </span>
  );
}
