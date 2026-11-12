import type { HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  /** Announced to screen readers (polite status). Pass a Vietnamese string in Vietnamese UIs. */
  label?: string;
  /** `sm` 16px (inline), `md` 24px, `lg` 32px (page or panel). */
  size?: 'sm' | 'md' | 'lg';
};

/** Small loading indicator for a short wait. Inherits the text color; for longer waits with a known amount use `Progress`. */
export function Spinner({ label = 'Loading', size = 'md', className, ...props }: SpinnerProps) {
  return (
    <span role="status" {...props} data-size={size} className={cx('cs-spinner', className)}>
      <span className="cs-spinner-ring" aria-hidden="true" />
      <span className="cs-visually-hidden">{label}</span>
    </span>
  );
}
