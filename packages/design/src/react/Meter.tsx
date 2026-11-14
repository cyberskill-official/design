import { Warning, XCircle } from '@phosphor-icons/react/ssr'; // the context-free build: this component renders in Server Components
import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';

/** `accent` gold (default), `primary` ink, `warning` and `danger` add an icon and screen-reader text. */
export type MeterTone = 'accent' | 'primary' | 'warning' | 'danger';

export type MeterProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  className?: string;
  /** The amount shown, between `min` and `max`. */
  value: number;
  min?: number;
  max?: number;
  /** Number format for the value. Without it, the value shows as a percentage of the range. */
  format?: Intl.NumberFormatOptions;
  /** Locale for that number format; the browser's or server's own when left out. */
  locale?: Intl.LocalesArgument;
  /** Visible label, also the meter's accessible name. */
  label: ReactNode;
  /** Text shown instead of the percentage, e.g. "720K of 1M". A string is also read by screen readers unless you pass `aria-valuetext`. */
  valueLabel?: ReactNode;
  tone?: MeterTone;
  /** Switches an `accent` or `primary` meter to `warning` once `value` reaches this number (same scale as `max`). */
  warnAt?: number;
  /** Screen-reader text added to the name in the `warning` tone. */
  warningLabel?: string;
  /** Screen-reader text added to the name in the `danger` tone. */
  dangerLabel?: string;
};

/**
 * Shows a known amount within a range, such as quota or storage used. For a task in progress, use `Progress`.
 * Plain markup (no hooks beyond `useId`, no event handlers), so it renders in Server Components with no JavaScript.
 */
export function Meter({ label, valueLabel, tone = 'accent', warnAt, warningLabel = 'Warning', dangerLabel = 'Critical', className, value, min = 0, max = 100, format, locale, ...props }: MeterProps) {
  const labelId = `${useId()}-label`;
  const resolved = (tone === 'accent' || tone === 'primary') && warnAt != null && value >= warnAt ? 'warning' : tone;
  const Icon = resolved === 'warning' ? Warning : resolved === 'danger' ? XCircle : null;
  const status = resolved === 'warning' ? warningLabel : resolved === 'danger' ? dangerLabel : null;
  const clamped = Math.min(Math.max(value, min), max);
  const percent = max > min ? ((clamped - min) / (max - min)) * 100 : 0;
  const formatted = new Intl.NumberFormat(locale, format ?? { style: 'percent' }).format(format ? clamped : percent / 100);
  return (
    <div
      role="meter"
      aria-labelledby={labelId}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-valuetext={typeof valueLabel === 'string' ? valueLabel : formatted}
      {...props}
      data-tone={resolved}
      className={cx('cs-meter', className)}
    >
      <span id={labelId} className="cs-meter-label">
        {label}
        {status && <span className="cs-visually-hidden">, {status}</span>}
      </span>
      <span className="cs-meter-value">
        {Icon && <Icon aria-hidden="true" />}
        <span aria-hidden="true">{valueLabel ?? formatted}</span>
      </span>
      <div className="cs-meter-track">
        <div className="cs-meter-indicator" style={{ insetInlineStart: 0, width: `${percent}%` }} />
      </div>
    </div>
  );
}
