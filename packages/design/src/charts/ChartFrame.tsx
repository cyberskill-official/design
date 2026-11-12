import { ChartBar, Table } from '@phosphor-icons/react';
import { useId, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../react/Button';
import { cx } from '../utils/cx';
import { chartColor, seriesColor, type ChartColor } from '../utils/chart-colors';

export { chartColor, seriesColor };
export type { ChartColor };

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

// One formatter per locale and style: charts ask on every render and building an Intl.NumberFormat is slow.
const formatters = new Map<string, ValueFormatter>();
function cachedFormatter(locale: Intl.LocalesArgument, options: Intl.NumberFormatOptions): ValueFormatter {
  const key = `${String(locale)} ${JSON.stringify(options)}`;
  let format = formatters.get(key);
  if (!format) {
    const nf = new Intl.NumberFormat(locale, options);
    format = v => nf.format(v);
    formatters.set(key, format);
  }
  return format;
}

/** Default value format in `locale`. A fixed locale (not the runtime one) keeps server and client HTML identical. */
export function numberFormatter(locale: Intl.LocalesArgument = 'en-US'): ValueFormatter {
  return cachedFormatter(locale, { maximumFractionDigits: 2 });
}
export const formatNumber: ValueFormatter = numberFormatter();
/** Axis ticks: in full under 10,000, compact (10K) on an axis that reaches it. One style per axis. */
export function axisFormatterFor(max: number, locale: Intl.LocalesArgument = 'en-US'): ValueFormatter {
  if (Math.abs(max) < 10_000) return numberFormatter(locale);
  return cachedFormatter(locale, { notation: 'compact', maximumFractionDigits: 1 });
}

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
  /** Locale of the default number format, e.g. `vi-VN` (1.550). Fixed to `en-US` by default so server and client render the same text. */
  locale?: Intl.LocalesArgument;
  /** Formats values in the table, tooltip and legend. Defaults to the `locale` number format. */
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
  title, description, data, series, xKey, xLabel, locale, valueFormatter = numberFormatter(locale), legend, legendMark = 'rect',
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
