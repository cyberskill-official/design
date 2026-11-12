import type { ComponentProps } from 'react';
import type { Tone } from './tone';
import { cx } from '../utils/cx';

export type IconTileSize = 'sm' | 'md' | 'lg';

export type IconTileProps = ComponentProps<'span'> & {
  /** Tint behind the icon and the icon's color. Defaults to `primary` (ink). */
  tone?: Tone;
  /** `sm` 28px, `md` 36px (default), `lg` 44px. */
  size?: IconTileSize;
};

/**
 * A soft tinted square holding one icon, e.g. beside a stat, a setting or a list item. Pass the icon as children.
 * Decorative (hidden from screen readers) unless you give it an `aria-label`; then it is announced as an image.
 */
export function IconTile({ tone = 'primary', size = 'md', className, ...props }: IconTileProps) {
  const named = props['aria-label'] != null || props['aria-labelledby'] != null;
  return (
    <span
      role={named ? 'img' : undefined}
      aria-hidden={named ? undefined : true}
      {...props}
      data-tone={tone}
      data-size={size}
      className={cx('cs-icon-tile', className)}
    />
  );
}
