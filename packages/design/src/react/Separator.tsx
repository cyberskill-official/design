import { Separator as BaseSeparator } from '@base-ui/react/separator';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type SeparatorProps = Omit<BaseSeparator.Props, 'className' | 'children'> & {
  className?: string;
  /** Text in the middle of the line, e.g. "or" / "hoặc". A string label also becomes the separator's accessible name. */
  label?: ReactNode;
};

/** A thin dividing line, horizontal (default) or vertical, announced as a separator. */
export function Separator({ label, orientation = 'horizontal', className, ...props }: SeparatorProps) {
  return (
    <BaseSeparator
      aria-label={typeof label === 'string' ? label : undefined}
      {...props}
      orientation={orientation}
      data-labelled={label != null || undefined}
      className={cx('cs-separator', className)}
    >
      {label != null && <span className="cs-separator-label">{label}</span>}
    </BaseSeparator>
  );
}
