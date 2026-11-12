import { useMemo } from 'react';
import { Area, AreaChart as RAreaChart, Bar, BarChart as RBarChart, BarStack, CartesianGrid, Line, LineChart as RLineChart, Tooltip, XAxis, YAxis, type LabelProps, type TooltipContentProps } from 'recharts';
import { axisFormatterFor, ChartFrame, ChartTooltipCard, formatValue, numberFormatter, seriesColor, valueOf, type ChartFrameProps, type ChartSeries, type ValueFormatter } from './ChartFrame';

export type CartesianChartProps = Omit<ChartFrameProps, 'children' | 'legendMark'> & {
  /** Height of the plot in px, x-axis labels included. */
  height?: number;
  /** Y-axis tick format. Defaults to full numbers, compact (10K) once the axis reaches 10,000. */
  axisFormatter?: ValueFormatter;
};

const MARGIN = { top: 8, right: 8, bottom: 0, left: 0 };
const ACTIVE_DOT = { r: 4, strokeWidth: 2, className: 'cs-chart-active-dot' };

/** How far from zero the y-axis reaches, so all-negative data gets compact ticks too. */
function maxValue(data: readonly object[], series: readonly ChartSeries[], stacked: boolean) {
  let max = 0;
  for (const row of data) {
    const values = series.map(s => Number(valueOf(row, s.key)) || 0);
    max = Math.max(max, stacked ? Math.abs(values.reduce((a, b) => a + b, 0)) : Math.max(...values.map(Math.abs)));
  }
  return max;
}

/** Grid, one x-axis, one y-axis and the token tooltip, shared by every cartesian preset. Recharts 3 accepts wrapped children. */
function CartesianChrome({ data, series, xKey, stacked, locale, valueFormatter, axisFormatter }: { data: readonly object[]; series: readonly ChartSeries[]; xKey: string; stacked: boolean; locale?: Intl.LocalesArgument; valueFormatter: ValueFormatter; axisFormatter?: ValueFormatter }) {
  const tick = useMemo(() => axisFormatter ?? axisFormatterFor(maxValue(data, series, stacked), locale), [axisFormatter, data, series, stacked, locale]);
  return (
    <>
      <CartesianGrid vertical={false} />
      <XAxis dataKey={xKey} tickLine={false} tickMargin={8} minTickGap={16} />
      <YAxis axisLine={false} tickLine={false} tickMargin={4} width="auto" niceTicks="snap125" tickCount={6} tickFormatter={(v: number) => tick(v)} />
      <Tooltip
        content={(p: TooltipContentProps) => (
          <ChartTooltipCard
            label={p.label}
            items={p.active ? series.flatMap((s, i) => {
              const entry = p.payload?.find(e => e.dataKey === s.key);
              return entry ? [{ key: s.key, label: s.label, color: seriesColor(s, i), value: formatValue(entry.value, valueFormatter) }] : [];
            }) : []}
          />
        )}
      />
    </>
  );
}

/** Series name at the end of its line, in muted text. Only drawn for four series or fewer. */
function endLabel(text: string, lastIndex: number) {
  return function EndLabel(p: LabelProps) {
    if (p.index !== lastIndex) return null;
    const { x = 0, y = 0 } = (p.viewBox ?? {}) as { x?: number; y?: number };
    return <text x={x + 8} y={y} dy="0.35em" className="cs-chart-direct-label">{text}</text>;
  };
}
const labelRoom = (series: readonly ChartSeries[]) => Math.max(0, ...series.map(s => s.label.length)) * 7 + 16;

export type BarChartProps = CartesianChartProps & {
  /** Stack the series in one bar per category instead of grouping them side by side. */
  stacked?: boolean;
};

/** Vertical bars, grouped or stacked. Bars stay at most 24px thick with 4px rounded data ends and a 2px surface gap. */
export function BarChart({ data, series, xKey, stacked = false, height = 240, locale, valueFormatter = numberFormatter(locale), axisFormatter, ...frame }: BarChartProps) {
  const bars = series.map((s, i) => <Bar key={s.key} dataKey={s.key} name={s.label} fill={seriesColor(s, i)} radius={stacked ? 0 : [4, 4, 0, 0]} />);
  return (
    <ChartFrame {...frame} data={data} series={series} xKey={xKey} valueFormatter={valueFormatter} legendMark="rect" data-chart="bar" data-stacked={stacked || undefined}>
      {a11y => (
        <RBarChart {...a11y} data={data as object[]} responsive style={{ width: '100%', height }} margin={MARGIN} barGap={2} maxBarSize={24}>
          <CartesianChrome data={data} series={series} xKey={xKey} stacked={stacked} locale={locale} valueFormatter={valueFormatter} axisFormatter={axisFormatter} />
          {stacked ? <BarStack radius={[4, 4, 0, 0]}>{bars}</BarStack> : bars}
        </RBarChart>
      )}
    </ChartFrame>
  );
}

export type LineChartProps = CartesianChartProps & {
  /** Series names at the end of each line. Defaults to on for four series or fewer. */
  directLabels?: boolean;
};

/** Trends over an ordered x-axis: 2px lines, an 8px ringed marker on hover, series names at the line ends. */
export function LineChart({ data, series, xKey, height = 240, locale, valueFormatter = numberFormatter(locale), axisFormatter, directLabels = series.length <= 4, ...frame }: LineChartProps) {
  const last = data.length - 1;
  return (
    <ChartFrame {...frame} data={data} series={series} xKey={xKey} valueFormatter={valueFormatter} legendMark="line" data-chart="line">
      {a11y => (
        <RLineChart {...a11y} data={data as object[]} responsive style={{ width: '100%', height }} margin={{ ...MARGIN, right: directLabels ? labelRoom(series) : MARGIN.right }}>
          <CartesianChrome data={data} series={series} xKey={xKey} stacked={false} locale={locale} valueFormatter={valueFormatter} axisFormatter={axisFormatter} />
          {series.map((s, i) => (
            <Line key={s.key} dataKey={s.key} name={s.label} type="monotone" stroke={seriesColor(s, i)} strokeWidth={2} dot={false} activeDot={ACTIVE_DOT} label={directLabels ? endLabel(s.label, last) : false} />
          ))}
        </RLineChart>
      )}
    </ChartFrame>
  );
}

export type AreaChartProps = LineChartProps & {
  /** Stack the areas so the top edge shows the total. */
  stacked?: boolean;
};

/** Lines with a 10% wash beneath, optionally stacked to show a total and its parts. */
export function AreaChart({ data, series, xKey, stacked = false, height = 240, locale, valueFormatter = numberFormatter(locale), axisFormatter, directLabels = series.length <= 4, ...frame }: AreaChartProps) {
  const last = data.length - 1;
  return (
    <ChartFrame {...frame} data={data} series={series} xKey={xKey} valueFormatter={valueFormatter} legendMark="rect" data-chart="area">
      {a11y => (
        <RAreaChart {...a11y} data={data as object[]} responsive style={{ width: '100%', height }} margin={{ ...MARGIN, right: directLabels ? labelRoom(series) : MARGIN.right }}>
          <CartesianChrome data={data} series={series} xKey={xKey} stacked={stacked} locale={locale} valueFormatter={valueFormatter} axisFormatter={axisFormatter} />
          {series.map((s, i) => (
            <Area
              key={s.key} dataKey={s.key} name={s.label} type="monotone" stackId={stacked ? 'stack' : undefined}
              stroke={seriesColor(s, i)} fill={seriesColor(s, i)} fillOpacity={0.1} strokeWidth={2} activeDot={ACTIVE_DOT}
              label={directLabels ? endLabel(s.label, last) : false}
            />
          ))}
        </RAreaChart>
      )}
    </ChartFrame>
  );
}
