# Progress

> A labelled bar for a task in progress, with a warning threshold and an indeterminate state. Meter shows a known amount such as quota used.

```tsx
import { Meter, Progress } from '@cyberskill/design';
```

Use **Progress** while a task runs: upload, import, export. Use **Meter** for a value that is not a task, such as API calls or storage used this month. For a short wait with no known amount, a [spinner](/docs/components/spinner) is lighter.

## Progress

The value text is a percentage of `max`. Pass `value={null}` when the amount is unknown.

```tsx
<Progress label="Uploading 3 files" value={value} />
```

## Tones and states

`warnAt` turns a bar amber once the value reaches it; `tone="danger"` marks a failure. Both add an icon beside the value, so the change does not rest on color alone.

```tsx
<Progress label="Importing contacts" value={64} />
<Progress label="Storage" value={86} warnAt={80} />
<Progress label="Import stopped" value={30} tone="danger" />
<Progress label="Preparing export" value={null} />
```

## Meter

`valueLabel` replaces the percentage with your own text, and is also what screen readers hear.

```tsx
<Meter label="API calls this month" value={720_000} max={1_000_000} valueLabel="720K of 1M" warnAt={800_000} />
<Meter label="Storage" value={8.6} max={10} valueLabel="8.6 of 10 GB" warnAt={8} />
<Meter label="Seats" value={10} max={10} valueLabel="10 of 10" tone="danger" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label and accessible name (required) |
| `value` | `number \| null` | – | Current value. null makes Progress indeterminate (Meter needs a number) |
| `min / max` | `number` | `0 / 100` | Range of the value |
| `tone` | `'primary' \| 'warning' \| 'danger'` | `'primary'` | Bar color; warning and danger add an icon |
| `warnAt` | `number` | – | Switches a primary bar to warning once value reaches it |
| `valueLabel` | `ReactNode` | – | Meter only: visible value text, e.g. "720K of 1M" |
| `format / locale` | `Intl.NumberFormatOptions / string` | – | Format the value text, e.g. compact numbers or vi-VN |
| `getAriaValueText` | `(formatted, value) => string` | – | Spoken value, e.g. a Vietnamese "indeterminate" text |

## Accessibility

- Progress is a `progressbar` and Meter a `meter`, each named by its label; screen readers read the value text (or `valueLabel`).
- The indeterminate bar slides; with reduced motion it becomes a still, faint full-width bar that does not look like a value.
- The bar meets 3:1 against its track in light and dark; value text meets 4.5:1.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type MeterProps = Omit<BaseUI.Meter.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Visible label, also the meter's accessible name. */
  label: ReactNode;
  /** Text shown instead of the percentage, e.g. "720K of 1M". A string is also read by screen readers unless you pass `aria-valuetext`. */
  valueLabel?: ReactNode;
  tone?: MeterTone;
  /** Switches a `primary` meter to `warning` once `value` reaches this number (same scale as `max`). */
  warnAt?: number;
};
type ProgressProps = Omit<BaseUI.Progress.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Visible label, also the progress bar's accessible name. */
  label: ReactNode;
  tone?: ProgressTone;
  /** Switches a `primary` bar to `warning` once `value` reaches this number (same scale as `max`). */
  warnAt?: number;
};
```
