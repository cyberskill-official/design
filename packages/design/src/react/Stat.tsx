import { ArrowDownRight, ArrowUpRight } from '@phosphor-icons/react';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../utils/cx';

export type StatDelta = {
  /** Change as shown, with its sign: "+8.4%", "−120". */
  value: ReactNode;
  /** Direction of the arrow. */
  trend: 'up' | 'down';
  /** Whether the change is good news. Defaults to `positive` for up and `negative` for down; set it for metrics where down is good (churn, latency). */
  sentiment?: 'positive' | 'negative' | 'neutral';
};

export type StatProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** What is measured, e.g. "Monthly revenue". */
  label: ReactNode;
  /** The figure, formatted: "$48,210", "1,284", "99.98%". */
  value: ReactNode;
  /** Change since the comparison period. Shown as an arrow and text, colored by sentiment. */
  delta?: StatDelta;
  /** Context for the delta or value, e.g. "vs. last month". */
  hint?: ReactNode;
  /** Slot under the figures, e.g. a sparkline. */
  children?: ReactNode;
  /** Screen-reader text after a good-news delta, since its color alone carries the meaning. */
  positiveLabel?: string;
  /** Screen-reader text after a bad-news delta. */
  negativeLabel?: string;
};

/** KPI tile: label, a large tabular figure, an optional change and a chart slot. */
export function Stat({ label, value, delta, hint, positiveLabel = 'positive change', negativeLabel = 'negative change', className, children, ...props }: StatProps) {
  const Arrow = delta?.trend === 'down' ? ArrowDownRight : ArrowUpRight;
  const sentiment = delta?.sentiment ?? (delta?.trend === 'up' ? 'positive' : 'negative');
  const sentimentText = sentiment === 'positive' ? positiveLabel : sentiment === 'negative' ? negativeLabel : null;
  return (
    <div {...props} className={cx('cs-stat', className)}>
      <div className="cs-stat-label">{label}</div>
      <div className="cs-stat-value">{value}</div>
      {(delta || hint) && (
        <div className="cs-stat-meta">
          {delta && (
            <span className="cs-stat-delta" data-trend={delta.trend} data-sentiment={sentiment}>
              <Arrow aria-hidden="true" />
              {delta.value}
              {sentimentText && <span className="cs-visually-hidden"> ({sentimentText})</span>}
            </span>
          )}
          {hint && <span className="cs-stat-hint">{hint}</span>}
        </div>
      )}
      {children != null && <div className="cs-stat-chart">{children}</div>}
    </div>
  );
}
