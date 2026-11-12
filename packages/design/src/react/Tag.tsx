import { X } from '@phosphor-icons/react';
import { useId, type ComponentProps, type MouseEvent } from 'react';
import type { CategoryTone } from './tone';
import { cx } from '../utils/cx';

export type TagProps = ComponentProps<'span'> & {
  /** Shows a remove (×) button. Move focus somewhere sensible after removing, e.g. the next tag or the input. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** First word of the remove button's accessible name; the tag text follows ("Remove SOC 2"). Pass "Xóa" in Vietnamese UIs. */
  removeLabel?: string;
  /** Category tint, e.g. one per team or project. `toneFor(text)` gives each value a stable tone. Defaults to neutral grey. */
  tone?: CategoryTone;
};

/** Compact label for categories, versions or plans ("SOC 2", "v2.4.1", "Enterprise"). Optionally removable. */
export function Tag({ onRemove, removeLabel = 'Remove', tone, className, children, ...props }: TagProps) {
  const id = useId();
  return (
    <span {...props} {...(tone && { 'data-tone': tone })} className={cx('cs-tag', className)}>
      <span id={id} className="cs-tag-label">{children}</span>
      {onRemove && (
        <button type="button" id={`${id}-remove`} className="cs-tag-remove" aria-label={removeLabel} aria-labelledby={`${id}-remove ${id}`} onClick={onRemove}>
          <X aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
