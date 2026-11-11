# Date picker

> Labelled date field. Type dd/mm/yyyy or pick from a calendar popup. Includes the date and time picker.

```tsx
import { FormField } from '@cyberskill/design/forms';
import { DatePicker, DateTimePicker } from '@cyberskill/design/date';
```

`DatePicker` is a text field for one date. People who know the date type it (`15/03/2026`, `1/3/2026`); everyone else opens the calendar with the button or Alt+↓. Use it in forms. For two dates use [Date range picker](/docs/components/date-range-picker), for a time add [Time picker](/docs/components/time-picker) or use `DateTimePicker` below. For a far-off date that people know by heart, such as a date of birth, typing is the fast path; the calendar also offers month and year dropdowns through `Calendar`.

```tsx
import { DatePicker, DateTimePicker } from '@cyberskill/design/date';
```

## States

Typed text is checked when the field loses focus or on Enter. Text that is not a real date, or falls outside `min`, `max` or `disabledDates`, stays in the field with `invalidMessage`, and `onValueChange` gets `null`: a form never keeps (or submits) the previous date while the field shows something else.

```tsx
const [start, setStart] = useState<Date | null>(new Date(2026, 2, 15));

<DatePicker label="Start date" value={start} onValueChange={setStart} description="Type dd/mm/yyyy or pick from the calendar." />
<DatePicker label="Delivery date" min={today} max={in30Days} disabledDates={{ dayOfWeek: [0] }} />
<DatePicker label="End date" error="The end date must be after the start date." />
<DatePicker label="Contract signed" defaultValue={signedOn} disabled />
```

## Vietnamese

`locale={vi}` from `react-day-picker/locale` translates the calendar and its screen-reader labels. Pass Vietnamese for the field's own words. The default format `dd/MM/yyyy` already matches Vietnamese order; `format` takes any date-fns pattern.

```tsx
import { vi } from 'react-day-picker/locale';

<DatePicker
  label="Ngày sinh"
  locale={vi}
  max={new Date()}
  invalidMessage="Ngày không hợp lệ. Nhập dạng dd/mm/yyyy."
  clearLabel="Xoá ngày"
  openLabel="Chọn ngày"
/>
```

## Date and time

`DateTimePicker` puts a date and a time field in one labelled group and gives you a single `Date`. It reports `null` until both parts are filled. `min` and `max` limit the time too, but only on their own day: with `min` at 15/03/2026 09:00, 15/03 lists times from 09:00 and rejects 08:30, while 16/03 takes any time.

```tsx
const [start, setStart] = useState<Date | null>(new Date(2026, 2, 15, 14, 30));

<DateTimePicker label="Meeting starts" value={start} onValueChange={setStart} step={30} />
```

## In a form

Pass `name` to submit the value with a plain `<form>`: a hidden input holds `yyyy-MM-dd` (`DateTimePicker`: `yyyy-MM-ddTHH:mm`), empty while there is no valid date. With React Hook Form, also pass `onBlur` and `inputRef` so blur validation works and a failed submit focuses the field; see [Forms](/docs/components/forms).

```tsx
<FormField
  control={control}
  name="start"
  rules={{ required: 'Pick a start date.' }}
  render={({ field, error }) => (
    <DatePicker label="Start date" name={field.name} value={field.value} onValueChange={field.onChange}
      onBlur={field.onBlur} inputRef={field.ref} error={error} />
  )}
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required) |
| `value / defaultValue` | `Date \| null` | `null` | Controlled or uncontrolled date |
| `onValueChange` | `(date: Date \| null) => void` | – | Called with a picked or valid typed date, or null when cleared or when the typed text is invalid |
| `name` | `string` | – | Submits a hidden input with yyyy-MM-dd (empty while invalid) |
| `inputRef / onBlur` | `Ref / FocusEventHandler` | – | Go to the visible input, for React Hook Form field.ref and field.onBlur |
| `format` | `string` | `'dd/MM/yyyy'` | date-fns pattern for showing and typing |
| `locale` | `Locale` | `English` | vi from react-day-picker/locale for Vietnamese |
| `min / max` | `Date` | – | First and last allowed day |
| `disabledDates` | `Matcher \| Matcher[]` | – | More days that cannot be picked |
| `weekStartsOn` | `0–6` | `1 (Monday)` | First day of the week |
| `invalidMessage` | `ReactNode` | `'Enter a valid date'` | Shown for text that is not an allowed date |
| `description / error` | `ReactNode` | – | Help text; an error from your form overrides invalidMessage |
| `clearLabel / openLabel` | `string` | `'Clear date' / 'Choose date'` | Names of the × and calendar buttons; openLabel also names the popup |
| `placeholder` | `string` | `'dd/mm/yyyy'` | Derived from format |

`DateTimePicker` takes the same date props plus `step` and `hourCycle` from Time picker, `dateLabel` / `timeLabel` (screen-reader names of the two inputs, default "Date" and "Time") and `invalidTimeMessage`. Its `name` submits one `yyyy-MM-ddTHH:mm` value, `inputRef` goes to the date input and `onBlur` fires as either input loses focus. Helpers `formatDate(date, format?, locale?)` and `parseDate(text, format?, locale?)` are exported for showing and reading dates in the same format elsewhere.

## Accessibility

- The input has the visible label; help and error text are linked to it, and an invalid date sets `aria-invalid`.
- Alt+↓ in the input, or the calendar button, opens the calendar with focus on the selected day (or today). Arrows move by day, Enter picks and closes. Escape closes and returns focus to where you opened it.
- The popup is a dialog named by `openLabel`. Tab leaves it.
- The × button clears the field and puts focus back in the input. Both buttons have names and a 44px touch area.

## Exact types

```ts
export type FormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, TTransformedValues = TFieldValues> = Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> & {
  render: (props: FormFieldRenderProps<TFieldValues, TName, TTransformedValues>) => ReactElement;
};
export type DatePickerProps = PickerFieldProps & {
  value?: Date | null;
  defaultValue?: Date | null;
  /** Called with the picked or typed date, or `null` when cleared or when the typed text is not an allowed date. */
  onValueChange?: (value: Date | null) => void;
  /** date-fns pattern for display and typing. */
  format?: string;
  /** date-fns locale, e.g. `vi` from `react-day-picker/locale` (also translates calendar labels). */
  locale?: Locale;
  min?: Date;
  max?: Date;
  /** Extra days that cannot be picked, as react-day-picker matchers, e.g. `{ dayOfWeek: [0, 6] }`. */
  disabledDates?: Matcher | Matcher[];
  /** 0 Sunday … 6 Saturday. Default Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};
export type DateTimePickerProps = Pick<DatePickerProps, 'format' | 'locale' | 'min' | 'max' | 'disabledDates' | 'weekStartsOn' | 'invalidMessage' | 'clearLabel' | 'openLabel' | 'onBlur'> & Pick<TimePickerProps, 'step' | 'hourCycle'> & {
  className?: string;
  /** Group label, e.g. "Meeting starts". */
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  value?: Date | null;
  defaultValue?: Date | null;
  /** Called with the combined date and time once both are set and allowed, `null` while either is empty or invalid. */
  onValueChange?: (value: Date | null) => void;
  /** Accessible names of the two inputs (the group label is visible). */
  dateLabel?: string;
  timeLabel?: string;
  /** Error for a typed time that is not a time, or is before `min` / after `max` on their days. */
  invalidTimeMessage?: ReactNode;
  /** Submits the value with a native form as one hidden input, `yyyy-MM-ddTHH:mm`. */
  name?: string;
  /** Ref to the date input, e.g. React Hook Form's `field.ref` so a failed submit focuses it. */
  inputRef?: DatePickerProps['inputRef'];
};
```
