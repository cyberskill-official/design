# Time picker

> Labelled time field. Type 9:30, 21:30 or 930, or choose from a list every 15 minutes.

```tsx
import { TimePicker } from '@cyberskill/design/date';
```

`TimePicker` is a text field for a time of day with a list of suggested times. Typing is the fast path and accepts `9:30`, `09.30`, `930`, `21:30`, `9h30`, `9:30 PM` and Vietnamese `SA`/`CH`. The list steps every 15 minutes by default and opens on the current time. For a date and a time together, use `DateTimePicker` from [Date picker](/docs/components/date-picker).

```tsx
import { TimePicker } from '@cyberskill/design/date';
```

The value is always 24-hour `"HH:mm"` (or `null`), whatever the field shows. A typed time between steps, such as `9:37`, is kept.

## States

```tsx
const [start, setStart] = useState<string | null>('09:30');

<TimePicker label="Start time" value={start} onValueChange={setStart} />
<TimePicker label="Appointment" min="08:00" max="17:30" step={30} />
<TimePicker label="Pickup" hourCycle={12} defaultValue="18:00" />
<TimePicker label="End time" error="The end time must be after the start time." />
```

## Vietnamese

24-hour time is the Vietnamese default, so only the words change.

```tsx
<TimePicker label="Giờ hẹn" step={30} min="08:00" max="20:00" invalidMessage="Giờ không hợp lệ (08:00 – 20:00)." />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required) |
| `value / defaultValue` | `string \| null` | `null` | 24-hour "HH:mm" |
| `onValueChange` | `(time: string \| null) => void` | – | Called with a picked or valid typed time, or null when cleared |
| `step` | `number` | `15` | Minutes between listed times |
| `min / max` | `string` | `'00:00' / '23:59'` | Allowed window, "HH:mm" |
| `hourCycle` | `12 \| 24` | `24` | 12 shows 9:30 PM; typing works either way |
| `locale` | `Locale` | `English` | date-fns locale for the AM/PM words |
| `invalidMessage` | `ReactNode` | `'Enter a valid time'` | Shown for text that is not a time inside min/max |
| `description / error` | `ReactNode` | – | Help text; an error from your form overrides invalidMessage |
| `placeholder` | `string` | `'hh:mm'` | Hint inside the empty field |

`parseTime(text)` and `formatTime(time, hourCycle?, locale?)` are exported for reading and showing times the same way elsewhere.

## Accessibility

- A Base UI combobox: the input has the visible label and the list is a listbox of options. Help and error text are linked to the input; an invalid time sets `aria-invalid`.
- ↓ or a click opens the list with the current time highlighted and in view. ↑/↓ move, Enter picks, Escape closes. Typing narrows the list ("14" shows 14:00 to 14:45).
- The current time is marked by a check and bold weight. List rows grow to 44px on touch screens.

## Exact types

```ts
type TimePickerProps = Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel' | 'required' | 'disabled'> & {
  className?: string;
  /** 24-hour `"HH:mm"`, whatever `hourCycle` shows. */
  value?: string | null;
  defaultValue?: string | null;
  /** Called with `"HH:mm"` or `null` when cleared. Invalid text never reaches it. */
  onValueChange?: (value: string | null) => void;
```
