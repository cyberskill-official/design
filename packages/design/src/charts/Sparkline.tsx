import type { HTMLAttributes } from 'react';
import { Line, LineChart, YAxis, type DotItemDotProps } from 'recharts';
import { cx } from '../utils/cx';
import { chartColor, type ChartColor } from './ChartFrame';

export type SparklineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'color'> & {
  data: readonly object[];
  /** Field holding each point's value. */
  dataKey: string;
  /** Accessible name stating the trend, e.g. "Revenue, last 12 weeks, up 8%". */
  label: string;
  /** Height in px. Width follows the container. */
  height?: number;
  /** Palette slot of the end marker (the current period). The line itself stays muted. */
  color?: ChartColor;
};

/** Tiny trend line for stat tiles: no axes, no tooltip, the current period marked. Put the exact numbers in the tile. */
export function Sparkline({ data, dataKey, label, height = 32, color = 1, className, style, ...props }: SparklineProps) {
  const last = data.length - 1;
  const endDot = ({ cx: x, cy: y, index }: DotItemDotProps) =>
    index === last && x != null && y != null ? <circle key="end" cx={x} cy={y} r={3} fill={chartColor(color)} className="cs-sparkline-dot" /> : null;
  return (
    <div {...props} role="img" aria-label={label} className={cx('cs-sparkline', className)} style={{ height, ...style }}>
      <LineChart data={data as object[]} responsive style={{ width: '100%', height }} margin={{ top: 4, right: 4, bottom: 4, left: 4 }} accessibilityLayer={false}>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Line dataKey={dataKey} type="monotone" stroke="var(--muted)" strokeWidth={1.5} dot={endDot} activeDot={false} isAnimationActive={false} />
      </LineChart>
    </div>
  );
}
