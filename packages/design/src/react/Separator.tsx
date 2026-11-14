import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export type SeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  /** Text in the middle of the line, e.g. "or" / "hoặc". A string label also becomes the separator's accessible name. */
  label?: ReactNode;
};

/** A thin dividing line, horizontal (default) or vertical, announced as a separator. Renders in Server Components. */
export function Separator({ label, orientation = 'horizontal', className, ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={typeof label === 'string' ? label : undefined}
      {...props}
      data-orientation={orientation}
      data-labelled={label != null || undefined}
      className={cx('cs-separator', className)}
    >
      {label != null && <span className="cs-separator-label">{label}</span>}
    </div>
  );
}
