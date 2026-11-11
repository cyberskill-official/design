import { ChartBar, Table } from '@phosphor-icons/react';
import { useId, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../react/Button';
import { cx } from '../utils/cx';

/** Slot in the fixed categorical palette: 1 Blue, 2 Gold, 3 Teal, 4 Magenta, 5 Violet. */
export type ChartColor = 1 | 2 | 3 | 4 | 5;

export type ChartSeries = {
  /** Field of each data row holding this series' value. */
  key: string;
  /** Name shown in the legend, tooltip and table. */
  label: string;
  /** Pin a palette slot so the color stays with the entity when filters hide other series. Defaults to the series' position. */
  color?: ChartColor;
};

export type ValueFormatter = (value: number) => string;

/** Props a chart spreads onto its Recharts root so the SVG is an image named by the frame title. */
export type ChartA11yProps = { role: 'img'; 'aria-labelledby': string; 'aria-describedby'?: string };

export type ChartLegendItem = { label: ReactNode; color: string; value?: ReactNode };

/** Color of a series: its pinned slot, else its position. Past five series the rest read as "Other" in muted gray; never cycled. */
export function chartColor(slot: number): string {
  return slot >= 1 && slot <= 5 ? `var(--chart-${slot})` : 'var(--muted)';
}
export const seriesColor = (s: ChartSeries, index: number) => chartColor(s.color ?? index + 1);

const full = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });
export const formatNumber: ValueFormatter = v => full.format(v);
/** Axis ticks: in full under 10,000, compact (10K) on an axis that reaches it. One style per axis. */
export const axisFormatterFor = (max: number): ValueFormatter => (Math.abs(max) >= 10_000 ? v => compact.format(v) : formatNumber);

export const valueOf = (row: object, key: string) => (row as Record<string, unknown>)[key];
export const formatValue = (v: unknown, format: ValueFormatter) => (typeof v === 'number' ? format(v) : v == null ? '–' : String(v));

export type ChartFrameProps = Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> & {
  /** Visible title; also names the chart image and the table view. */
  title: ReactNode;
  description?: ReactNode;
  data: readonly object[];
  series: readonly ChartSeries[];
  /** Field holding the category or date of each row. */
  xKey: string;
  /** Header of the first column in the table view. Defaults to `xKey`. */
  xLabel?: string;
  valueFormatter?: ValueFormatter;
  /** Legend entries. Defaults to one per series when there are two or more; `false` hides it. */
  legend?: ChartLegendItem[] | false;
  /** Legend swatch shape: `rect` for bars and areas, `line` for lines. */
  legendMark?: 'rect' | 'line';
  /** Toggle label while the chart shows, e.g. "Xem bảng". */
  showTableLabel?: string;
  /** Toggle label while the table shows, e.g. "Xem biểu đồ". */
  showChartLabel?: string;
  /** Renders the chart. Spread the given props onto the Recharts root (`<BarChart {...a11y}>`). */
  children: (a11y: ChartA11yProps) => ReactNode;
};

/** Card around any chart: title, description, legend and a "Show table" toggle that swaps the chart for an accessible table of the same data. */
export function ChartFrame({
  title, description, data, series, xKey, xLabel, valueFormatter = formatNumber, legend, legendMark = 'rect',
  showTableLabel = 'Show table', showChartLabel = 'Show chart', className, children, ...props
}: ChartFrameProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = description ? `${id}-desc` : undefined;
  const [tableView, setTableView] = useState(false);
  const items: ChartLegendItem[] = legend === false ? [] : (legend ?? (series.length >= 2 ? series.map((s, i) => ({ label: s.label, color: seriesColor(s, i) })) : []));

  return (
    <figure {...props} aria-labelledby={titleId} className={cx('cs-chart', className)}>
      <div className="cs-chart-header">
        <div className="cs-chart-heading">
          <div id={titleId} className="cs-chart-title">{title}</div>
          {description && <p id={descId} className="cs-chart-description">{description}</p>}
        </div>
        <Button variant="ghost" size="sm" iconStart={tableView ? <ChartBar /> : <Table />} onClick={() => setTableView(v => !v)}>
          {tableView ? showChartLabel : showTableLabel}
        </Button>
      </div>
      {items.length > 0 && !tableView && (
        <ul className="cs-chart-legend">
          {items.map((item, i) => (
            <li key={i}>
              <span className="cs-chart-swatch" data-mark={legendMark} style={{ '--_color': item.color } as CSSProperties} aria-hidden="true" />
              <span>{item.label}</span>
              {item.value != null && <span className="cs-chart-legend-value">{item.value}</span>}
            </li>
          ))}
        </ul>
      )}
      {tableView ? (
        <div className="cs-chart-table-scroll">
          <table className="cs-chart-table" aria-labelledby={titleId}>
            <thead>
              <tr>
                <th scope="col">{xLabel ?? xKey}</th>
                {series.map(s => <th key={s.key} scope="col" data-numeric="">{s.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <th scope="row">{formatValue(valueOf(row, xKey), String)}</th>
                  {series.map(s => <td key={s.key} data-numeric="">{formatValue(valueOf(row, s.key), valueFormatter)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cs-chart-plot">{children({ role: 'img', 'aria-labelledby': titleId, 'aria-describedby': descId })}</div>
      )}
    </figure>
  );
}

export type ChartTooltipItem = { key: string; label: ReactNode; color: string; value: ReactNode };

/** Tooltip card: value first in strong text, series name after in muted, keyed by a short stroke of the series color. */
export function ChartTooltipCard({ label, items }: { label?: ReactNode; items: ChartTooltipItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="cs-chart-tooltip">
      {label != null && label !== '' && <div className="cs-chart-tooltip-label">{label}</div>}
      <ul>
        {items.map(item => (
          <li key={item.key}>
            <span className="cs-chart-tooltip-key" style={{ '--_color': item.color } as CSSProperties} aria-hidden="true" />
            <span className="cs-chart-tooltip-value">{item.value}</span>
            <span className="cs-chart-tooltip-name">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
