import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ReactNode } from 'react';
import { toneIcons } from './Alert';
import { cx } from '../utils/cx';

export type MeterTone = 'primary' | 'warning' | 'danger';

export type MeterProps = Omit<BaseMeter.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Visible label, also the meter's accessible name. */
  label: ReactNode;
  /** Text shown instead of the percentage, e.g. "720K of 1M". A string is also read by screen readers unless you pass `aria-valuetext`. */
  valueLabel?: ReactNode;
  tone?: MeterTone;
  /** Switches a `primary` meter to `warning` once `value` reaches this number (same scale as `max`). */
  warnAt?: number;
  /** Screen-reader text added to the name in the `warning` tone. */
  warningLabel?: string;
  /** Screen-reader text added to the name in the `danger` tone. */
  dangerLabel?: string;
};

/** Shows a known amount within a range, such as quota or storage used. For a task in progress, use `Progress`. */
export function Meter({ label, valueLabel, tone = 'primary', warnAt, warningLabel = 'Warning', dangerLabel = 'Critical', className, value, ...props }: MeterProps) {
  const resolved = tone === 'primary' && warnAt != null && value >= warnAt ? 'warning' : tone;
  const Icon = resolved === 'primary' ? null : toneIcons[resolved];
  const status = resolved === 'warning' ? warningLabel : resolved === 'danger' ? dangerLabel : null;
  return (
    <BaseMeter.Root
      aria-valuetext={typeof valueLabel === 'string' ? valueLabel : undefined}
      {...props}
      value={value}
      data-tone={resolved}
      className={cx('cs-meter', className)}
    >
      <BaseMeter.Label className="cs-meter-label">
        {label}
        {status && <span className="cs-visually-hidden">, {status}</span>}
      </BaseMeter.Label>
      <span className="cs-meter-value">
        {Icon && <Icon aria-hidden="true" />}
        <BaseMeter.Value>{valueLabel != null ? () => valueLabel : undefined}</BaseMeter.Value>
      </span>
      <BaseMeter.Track className="cs-meter-track">
        <BaseMeter.Indicator className="cs-meter-indicator" />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
