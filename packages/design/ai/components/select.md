# Select

> Pick one option from a list in a dropdown. Labelled field, keyboard and typeahead built in.

```tsx
import { Select, SelectField } from '@cyberskill/design';
```

Use a select to pick one value from a known list of about 5 to 15 options: a plan, a region, a role. With 2 to 5 options that should stay visible, use a radio group or a segmented control. With long lists that people search, use a combobox. `SelectField` is the common case: a label, the select, help and error text. Use `Select` on its own only when something else labels it, and give it an `aria-label`.

## States

```tsx
const plans = [
  { value: 'starter', label: 'Starter' },
  { value: 'team', label: 'Team' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise (contact sales)', disabled: true },
];

<SelectField label="Plan" items={plans} placeholder="Choose a plan" description="You can change plans at any time." />
<SelectField label="Region" items={regions} placeholder="Choose a region" error="Choose where your data is stored." />
<SelectField label="Seats" items={plans} defaultValue="team" disabled />
```

## Sizes

`sm` is 32px, `md` 40px and `lg` 48px tall, matching text fields and buttons.

```tsx
<Select aria-label="Plan" items={plans} size="sm" defaultValue="starter" />
<Select aria-label="Plan" items={plans} defaultValue="team" />
<Select aria-label="Plan" items={plans} size="lg" defaultValue="business" />
```

## Groups

Put `{ label, items }` entries in `items` to split the list into titled sections. Groups and loose options can mix; the trigger shows the chosen option's label either way.

```tsx
const regions = [
  { label: 'Asia Pacific', items: [{ value: 'sg', label: 'Singapore' }, { value: 'hcm', label: 'Ho Chi Minh City' }] },
  { label: 'Europe', items: [{ value: 'fra', label: 'Frankfurt' }, { value: 'ams', label: 'Amsterdam (full)', disabled: true }] },
];

<SelectField label="Region" items={regions} placeholder="Choose a region" defaultValue="hcm" />
```

## Controlled

```tsx
const [plan, setPlan] = useState<string | null>('team');
<SelectField label="Plan" items={plans} value={plan} onValueChange={setPlan} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `({ value, label, disabled? } \| { label, items })[]` | – | Options in display order, optionally in titled groups (required). label is shown in the list and in the trigger |
| `placeholder` | `ReactNode` | – | Shown while nothing is chosen |
| `value / defaultValue` | `Value \| null` | – | Controlled or initial value. Use null for "nothing chosen" |
| `onValueChange` | `(value, details) => void` | – | Called when the user picks an option |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |
| `label` | `ReactNode` | – | SelectField only: visible label (required) |
| `description / error` | `ReactNode` | – | SelectField only: help text, and an error that marks the field invalid |
| `required / disabled / name` | `boolean / boolean / string` | – | Form semantics; the value is submitted under name |
| `ref / onBlur` | `Ref<HTMLButtonElement> / handler` | – | Go to the trigger, so form libraries can focus it on error |

`Select` also takes `aria-label` and `className` (for the trigger). Other Base UI root props (`open`, `onOpenChange`, `inputRef`, `isItemEqualToValue`…) pass through.

## Accessibility

- The trigger is a combobox named by the label; help and error text are its description. Clicking the label focuses the trigger without opening the list, like a native select.
- Enter, Space or the arrow keys open the list. Arrow keys move, Enter picks, Escape closes and returns focus. Typing a letter jumps to the matching option.
- The selected option is marked with a check and `aria-selected`; disabled options are skipped.
- Each group is a `group` named by its label, so screen readers announce "Europe, group" when the highlight enters it.
- The error message has a warning icon beside it, hidden from screen readers; the trigger's description is the message text only.
- The list opens under the trigger and stays inside the viewport.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type SelectProps<Value = string> = Omit<BaseUI.Select.Root.Props<Value>, 'items' | 'children' | 'multiple'> & {
  /** Options in display order, optionally in titled groups (`{ label, items }`). `label` is shown in the list and in the trigger once chosen. */
  items: (SelectItem<Value> | SelectGroup<Value>)[];
  /** Shown in the trigger while nothing is chosen, e.g. "Choose a plan". */
  placeholder?: ReactNode;
  size?: SelectSize;
  /** Class for the trigger button. */
  className?: string;
  /** Ref to the trigger button (what form libraries focus on error). */
  ref?: Ref<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  /** Accessible name when there is no visible label. Prefer `SelectField`. */
  'aria-label'?: string;
};
export type SelectFieldProps<Value = string> = SelectProps<Value> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  fieldClassName?: string;
};
```
