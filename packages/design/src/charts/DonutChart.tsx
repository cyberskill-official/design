import type { ReactNode } from 'react';
import { Cell, Pie, PieChart, Tooltip, type TooltipContentProps } from 'recharts';
import { chartColor, ChartFrame, ChartTooltipCard, formatValue, numberFormatter, valueOf, type ChartColor, type ChartFrameProps } from './ChartFrame';

export type DonutChartProps = Omit<ChartFrameProps, 'children' | 'legend' | 'legendMark'> & {
  /** Plot height in px; the ring fills it. */
  height?: number;
  /** Small text under the center figure, e.g. "Total" / "Tổng". */
  centerLabel?: ReactNode;
  /** Center figure. Defaults to the formatted total. */
  centerValue?: ReactNode;
  /** Pin palette slots per slice name so colors follow the entity across filters. Defaults to the slice's position. */
  colors?: Partial<Record<string, ChartColor>>;
};

/**
 * Part-to-whole for at most five slices, read clockwise from the top. `xKey` names each slice and `series[0].key` holds its value.
 * The legend lists each slice with its value and share. For close values or more slices, use a bar chart.
 */
export function DonutChart({ data, series, xKey, height = 200, locale, valueFormatter = numberFormatter(locale), centerLabel, centerValue, colors, ...frame }: DonutChartProps) {
  const valueKey = series[0]?.key ?? 'value';
  const total = data.reduce((sum, row) => sum + (Number(valueOf(row, valueKey)) || 0), 0);
  const slices = data.map((row, i) => {
    const name = String(valueOf(row, xKey));
    const value = Number(valueOf(row, valueKey)) || 0;
    return { name, value, color: chartColor(colors?.[name] ?? i + 1), share: total ? Math.round((value / total) * 100) : 0 };
  });

  return (
    <ChartFrame
      {...frame} data={data} series={series} xKey={xKey} valueFormatter={valueFormatter} data-chart="donut"
      legend={slices.map(s => ({ label: s.name, color: s.color, value: `${valueFormatter(s.value)} · ${s.share}%` }))}
    >
      {a11y => (
        <div className="cs-donut" style={{ height }}>
          <PieChart {...a11y} responsive style={{ width: '100%', height }}>
            <Pie data={data as object[]} dataKey={valueKey} nameKey={xKey} innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} stroke="none">
              {slices.map(s => <Cell key={s.name} fill={s.color} className="cs-donut-slice" />)}
            </Pie>
            <Tooltip
              content={(p: TooltipContentProps) => {
                const entry = p.active ? p.payload?.[0] : undefined;
                const slice = slices.find(s => s.name === String(entry?.name));
                return entry && slice ? <ChartTooltipCard items={[{ key: slice.name, label: slice.name, color: slice.color, value: `${formatValue(entry.value, valueFormatter)} · ${slice.share}%` }]} /> : null;
              }}
            />
          </PieChart>
          <div className="cs-donut-center">
            <span className="cs-donut-value">{centerValue ?? valueFormatter(total)}</span>
            {centerLabel && <span className="cs-donut-label">{centerLabel}</span>}
          </div>
        </div>
      )}
    </ChartFrame>
  );
}
