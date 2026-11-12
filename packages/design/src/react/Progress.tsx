import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ReactNode } from 'react';
import { toneIcons } from './Alert';
import { cx } from '../utils/cx';

/** `accent` gold (default), `primary` ink, `warning` and `danger` add an icon and screen-reader text. */
export type ProgressTone = 'accent' | 'primary' | 'warning' | 'danger';

export type ProgressProps = Omit<BaseProgress.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Visible label, also the progress bar's accessible name. */
  label: ReactNode;
  tone?: ProgressTone;
  /** Switches an `accent` or `primary` bar to `warning` once `value` reaches this number (same scale as `max`). */
  warnAt?: number;
  /** Screen-reader text added to the name in the `warning` tone. */
  warningLabel?: string;
  /** Screen-reader text added to the name in the `danger` tone. */
  dangerLabel?: string;
};

/**
 * Labelled bar for a task that takes time (upload, export, import). `value={null}` shows an indeterminate bar.
 * For a static amount such as quota used, use `Meter`.
 */
export function Progress({ label, tone = 'accent', warnAt, warningLabel = 'Warning', dangerLabel = 'Critical', className, value, ...props }: ProgressProps) {
  const resolved = (tone === 'accent' || tone === 'primary') && warnAt != null && value != null && value >= warnAt ? 'warning' : tone;
  const Icon = resolved === 'warning' || resolved === 'danger' ? toneIcons[resolved] : null;
  const status = resolved === 'warning' ? warningLabel : resolved === 'danger' ? dangerLabel : null;
  return (
    <BaseProgress.Root {...props} value={value} data-tone={resolved} className={cx('cs-progress', className)}>
      <BaseProgress.Label className="cs-progress-label">
        {label}
        {status && <span className="cs-visually-hidden">, {status}</span>}
      </BaseProgress.Label>
      {(value != null || Icon) && (
        <span className="cs-progress-value">
          {Icon && <Icon aria-hidden="true" />}
          {value != null && <BaseProgress.Value />}
        </span>
      )}
      <BaseProgress.Track className="cs-progress-track">
        <BaseProgress.Indicator className="cs-progress-indicator" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
