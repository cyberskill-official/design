# Stat

> KPI tile with a label, a large tabular figure, an optional change and a chart slot.

```tsx
import { Stat } from '@cyberskill/design';
```

Use a stat for a headline number on a dashboard: revenue, active users, error rate. Show three to five in a row. For many numbers at once use a [Table](/docs/components/table).

## Change and sentiment

`delta.trend` sets the arrow, `delta.sentiment` the color. Sentiment defaults to positive for up and negative for down; set it for metrics where down is good (churn, latency, cost).

```tsx
<Stat label="Monthly revenue" value="$48,210" delta={{ value: '+8.4%', trend: 'up' }} hint="vs. last month" />
<Stat label="Churn" value="2.1%" delta={{ value: '−0.4 pts', trend: 'down', sentiment: 'positive' }} hint="vs. last month" />
<Stat label="p95 latency" value="412 ms" delta={{ value: '+38 ms', trend: 'up', sentiment: 'negative' }} hint="vs. yesterday" />
```

## With a sparkline

Children render under the figures. Give the chart a text alternative.

```tsx
<Stat label="Active users" value="1,284" delta={{ value: '+12%', trend: 'up' }} hint="vs. last week">
  <svg role="img" aria-label="Active users rising over the last 10 weeks">…</svg>
</Stat>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Required. What is measured |
| `value` | `ReactNode` | – | Required. The formatted figure, shown in the display font with tabular numbers |
| `delta` | `{ value, trend: 'up' \| 'down', sentiment?: 'positive' \| 'negative' \| 'neutral' }` | – | Change shown as an arrow and text, colored by sentiment |
| `hint` | `ReactNode` | – | Context such as "vs. last month" |
| `children` | `ReactNode` | – | Slot under the figures, e.g. a sparkline |
| `positiveLabel / negativeLabel` | `string` | `'positive change' / 'negative change'` | Visually hidden text after the change, e.g. "tích cực" / "tiêu cực" |

## Accessibility

- Label, value, change and hint are plain text, read in that order.
- The change is never color alone: the arrow shows the direction and the text carries the sign ("+8.4%", "−0.4 pts"). Write the sign in `delta.value`.
- Whether the change is good news is also text: screen readers hear "−0.4 pts (positive change)" for churn. Neutral changes add nothing. Pass `positiveLabel` and `negativeLabel` in Vietnamese UIs.
- Format numbers before passing them (`Intl.NumberFormat('vi-VN')` in Vietnamese UIs).
- A sparkline needs `role="img"` and an `aria-label` that says the trend, or `aria-hidden` if the hint already says it.

## Exact types

```ts
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
```
