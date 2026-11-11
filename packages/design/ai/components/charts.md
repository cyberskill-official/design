# Charts

> Bar, line, area and donut presets on Recharts, plus a sparkline. Token colors, a hover tooltip and a table view on every chart.

```tsx
import { AreaChart, BarChart, ChartFrame, DonutChart, LineChart, Sparkline } from '@cyberskill/design/charts';
```

Chart presets for dashboards and reports. Each one sits in a `ChartFrame` card with a title, a legend for two or more series, a hover and keyboard tooltip, and a **Show table** toggle that swaps the chart for a table of the same numbers. They live in their own entry, so apps that never draw a chart never load Recharts:

```tsx
import { BarChart, LineChart, AreaChart, DonutChart, Sparkline } from '@cyberskill/design/charts';
```

Pick the form from the question. Comparing categories: bars. A trend over time: a line. A total and its parts over time: stacked area or stacked bars. One whole split into at most five parts: a donut. A single number: a stat tile, not a chart. Series take the categorical palette in a fixed order (blue, gold, teal, magenta, violet) that flips with the theme; colors are never cycled.

## Bar chart

Grouped by default. Bars stay at most 24px thick, with 4px rounded data ends and a 2px gap between neighbors.

```tsx
const series = [{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Mobile' }, { key: 'api', label: 'API' }];

<BarChart title="Signups by month" description="All channels" data={signups} series={series} xKey="month" xLabel="Month" />
```

`stacked` puts the series in one bar per category, split by a 2px surface gap, with only the top of the stack rounded.

```tsx
<BarChart title="Signups by channel" data={signups} series={series} xKey="month" stacked />
```

## Line chart

2px lines, an 8px ringed marker on hover, and the series name at the end of each line when there are four series or fewer (`directLabels`).

```tsx
<LineChart title="Active users" data={signups} series={series} xKey="month" xLabel="Month" />
```

## Area chart

A line with a 10% wash beneath. `stacked` shows a total and its parts.

```tsx
<AreaChart title="Traffic" data={signups} series={[{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Mobile' }]} xKey="month" stacked />
```

## Donut chart

Part-to-whole for at most five slices. `xKey` names each slice and `series[0].key` holds its value. The legend gives each slice's value and share; the center shows the total. For close values, use bars.

```tsx
<DonutChart
  title="Visits by browser" data={browsers} xKey="browser" xLabel="Browser"
  series={[{ key: 'visits', label: 'Visits' }]} centerLabel="Total visits"
/>
```

## Keep a color with its entity

A series takes the palette slot of its position. When a filter hides some series, pin `color` (1–5) so the rest keep their colors: here Mobile stays gold after Web is filtered out. `DonutChart` takes `colors={{ Chrome: 1 }}` keyed by slice name.

```tsx
<BarChart title="Mobile and API" data={signups} xKey="month"
  series={[{ key: 'mobile', label: 'Mobile', color: 2 }, { key: 'api', label: 'API', color: 3 }]} />
```

## Vietnamese and number formats

Every label is a prop. `valueFormatter` formats tooltip, legend and table values; `axisFormatter` formats y-axis ticks (full numbers, compact once the axis reaches 10,000).

```tsx
<LineChart
  title="Người dùng hoạt động" description="Theo tháng" data={signups} xKey="month" xLabel="Tháng"
  series={[{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Di động' }]}
  showTableLabel="Xem bảng" showChartLabel="Xem biểu đồ"
  valueFormatter={(v) => new Intl.NumberFormat('vi-VN').format(v)}
/>
```

## Sparkline

A tiny trend for stat tiles: no axes and no tooltip, a muted line with the current period marked. Give it a `label` that states the trend; put the exact figure in the tile.

```tsx
<Sparkline data={weeks} dataKey="revenue" label="Weekly revenue, last 8 weeks, up 104%" />
```

## Your own Recharts chart

`ChartFrame` gives any Recharts chart the same card, legend and table view. Spread the props it passes onto the chart root so the SVG is an image named by the title.

```tsx
<ChartFrame title="Signups and target" data={signups} series={series} xKey="month">
  {(a11y) => (
    <ComposedChart {...a11y} data={signups} responsive style={{ width: '100%', height: 240 }}>…</ComposedChart>
  )}
</ChartFrame>
```

## Props

Shared by `BarChart`, `LineChart`, `AreaChart` and `DonutChart`:

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | – | Visible title; names the chart image and the table view |
| `description` | `ReactNode` | – | Line under the title; describes the chart image |
| `data` | `object[]` | – | Rows of data |
| `series` | `{ key, label, color? }[]` | – | Fields to plot, in palette order. color pins a slot 1–5 |
| `xKey` | `string` | – | Field with the category or date of each row |
| `xLabel` | `string` | `xKey` | Header of the first table-view column |
| `valueFormatter` | `(value: number) => string` | `locale number` | Tooltip, legend and table values |
| `height` | `number` | `240 (donut 200)` | Plot height in px, axis labels included |
| `showTableLabel / showChartLabel` | `string` | `'Show table' / 'Show chart'` | Toggle labels |
| `legend` | `ChartLegendItem[] \| false` | `one per series (2+)` | Override or hide the legend |

Per preset: `BarChart` and `AreaChart` take `stacked`; `LineChart` and `AreaChart` take `directLabels` (default on for four series or fewer); cartesian charts take `axisFormatter`; `DonutChart` takes `centerLabel`, `centerValue` and `colors`. `Sparkline` takes `data`, `dataKey`, `label`, `height` (32) and `color` (the end marker's slot).

## Accessibility

- Each chart is an image named by its title and described by its description. Tab focuses it; the arrow keys move the tooltip across the data, the same readout as hover.
- **Show table** swaps the chart for a real `<table>` of every value, named by the same title. This is the accessible equivalent; no value lives only in a tooltip or a color.
- Marks have at least 3:1 contrast on the card in both themes; all text, including tooltip, legend and axis labels, uses text tokens, never a series color.
- The legend names every series next to its swatch, so identity never rests on color alone.

## Exact types

```ts
type AreaChartProps = LineChartProps & {
  /** Stack the areas so the top edge shows the total. */
  stacked?: boolean;
};
type BarChartProps = CartesianChartProps & {
  /** Stack the series in one bar per category instead of grouping them side by side. */
  stacked?: boolean;
};
type ChartFrameProps = Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> & {
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
type DonutChartProps = Omit<ChartFrameProps, 'children' | 'legend' | 'legendMark'> & {
  /** Plot height in px; the ring fills it. */
  height?: number;
  /** Small text under the center figure, e.g. "Total" / "Tổng". */
  centerLabel?: ReactNode;
  /** Center figure. Defaults to the formatted total. */
  centerValue?: ReactNode;
  /** Pin palette slots per slice name so colors follow the entity across filters. Defaults to the slice's position. */
  colors?: Partial<Record<string, ChartColor>>;
};
type LineChartProps = CartesianChartProps & {
  /** Series names at the end of each line. Defaults to on for four series or fewer. */
  directLabels?: boolean;
};
type SparklineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'color'> & {
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
```
