# Date range picker

> Labelled field for a start and end date, with a two-month calendar and optional presets.

```tsx
import { DateRangePicker, DateRangeValue } from '@cyberskill/design/date';
```

`DateRangePicker` picks a start and an end date: a stay, a report period, a campaign. Type both dates (`01/03/2026 – 15/03/2026`; a plain `-` works too, with spaces around it when the format itself has hyphens), click two days on the calendar, or use a preset. Use two separate [Date pickers](/docs/components/date-picker) when the dates are unrelated or far apart.

```tsx
import { DateRangePicker, rangePresets } from '@cyberskill/design/date';
```

## Pick two days

The first click starts a new range, the second finishes it and closes the popup; picking the end first works too. From 640px wide the calendar shows two months, one below that.

```tsx
const [stay, setStay] = useState<DateRangeValue | null>(null);

<DateRangePicker label="Stay" value={stay} onValueChange={setStay} min={new Date()} />
```

## Presets

`rangePresets()` returns Today, Last 7 days, Last 30 days and This month (the 1st to today). Call it while rendering so "today" stays current, or pass your own `{ label, value }` list. The active preset is marked as pressed. A preset whose start or end falls outside `min`, `max` or `disabledDates` is disabled, not clamped: the same rule as a typed range, so "Last 30 days" with `min` set to the 1st of this month cannot be picked.

```tsx
const presets = rangePresets();

<DateRangePicker label="Report period" value={period} onValueChange={setPeriod} presets={presets} max={new Date()} />
```

## In a form

`name` submits the range as two hidden inputs, `name[from]` and `name[to]`, each `yyyy-MM-dd` (empty while there is no valid range). `name="stay"` sends `stay[from]=2026-03-01&stay[to]=2026-03-15`, which most servers read as `{ stay: { from, to } }`. With React Hook Form pass `onBlur` and `inputRef` as for [Date picker](/docs/components/date-picker#in-a-form). Typed text that is not two allowed dates stays in the field with `invalidMessage` and reports `null`.

## Vietnamese

```tsx
import { vi } from 'react-day-picker/locale';

<DateRangePicker
  label="Kỳ báo cáo"
  locale={vi}
  presets={rangePresets({ today: 'Hôm nay', last7Days: '7 ngày qua', last30Days: '30 ngày qua', thisMonth: 'Tháng này' })}
  presetsLabel="Chọn nhanh"
  clearLabel="Xoá ngày"
  openLabel="Chọn khoảng ngày"
  invalidMessage="Nhập hai ngày dạng dd/mm/yyyy – dd/mm/yyyy."
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required) |
| `value / defaultValue` | `{ from: Date; to: Date } \| null` | `null` | Controlled or uncontrolled range |
| `onValueChange` | `(range \| null) => void` | – | Called when a full range is picked or typed, or null when cleared or the typed text is invalid |
| `name` | `string` | – | Submits name[from] and name[to] as yyyy-MM-dd |
| `inputRef / onBlur` | `Ref / FocusEventHandler` | – | Go to the visible input, for React Hook Form |
| `presets` | `{ label: string; value: { from; to } }[]` | – | Quick picks beside the calendar, e.g. rangePresets(); disabled when outside min / max / disabledDates |
| `presetsLabel` | `string` | `'Presets'` | Name of the presets group |
| `numberOfMonths` | `number` | `2 wide, 1 narrow` | Months side by side |
| `format / locale` | `string / Locale` | `'dd/MM/yyyy' / English` | As in Date picker |
| `min / max / disabledDates` | `Date / Matcher` | – | Allowed days; typed ranges outside them are invalid |
| `invalidMessage` | `ReactNode` | `'Enter a valid date'` | Shown for text that is not two allowed dates |
| `clearLabel / openLabel` | `string` | `'Clear dates' / 'Choose dates'` | Names of the × and calendar buttons |

`rangePresets(labels?, today?)` takes partial labels `{ today, last7Days, last30Days, thisMonth }` and an optional reference day.

## Accessibility

- One labelled input holds the whole range, so screen readers read it as one value: "Stay, 01/03/2026 – 15/03/2026".
- Alt+↓ or the calendar button opens a dialog with focus on the start day. Arrows move, Enter picks the start then the end, Escape closes and returns focus.
- Presets are buttons in a labelled group; the active one has `aria-pressed`.
- Range days are announced as selected; start and end are filled, the middle sits on a band with 4.5:1 text contrast.

## Exact types

```ts
export type DateRangePickerProps = Omit<PickerFieldProps, 'placeholder' | 'name'> & {
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  /** Called with a full range, or `null` when cleared or when the typed text is not two allowed dates. */
  onValueChange?: (value: DateRangeValue | null) => void;
  /** Submits the range with a native form as two hidden inputs, `name[from]` and `name[to]`, each `yyyy-MM-dd`. */
  name?: string;
  /** date-fns pattern for each date. */
  format?: string;
  locale?: Locale;
  min?: Date;
  max?: Date;
  disabledDates?: Matcher | Matcher[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Quick picks beside the calendar, e.g. `rangePresets()`. A preset with a start or end outside `min`, `max` or `disabledDates` is disabled. */
  presets?: DateRangePreset[];
  /** Accessible name of the presets group. */
  presetsLabel?: string;
  /** Months side by side. Default 2 from 640px wide, 1 below. */
  numberOfMonths?: number;
  /** Defaults to `dd/mm/yyyy – dd/mm/yyyy` from `format`. */
  placeholder?: string;
};
```
