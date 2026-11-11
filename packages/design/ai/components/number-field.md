# Number field

> A labelled number input with − and + steppers, limits, steps and locale-aware formatting.

```tsx
import { NumberField } from '@cyberskill/design';
```

Use a number field for quantities people adjust in small steps: seats, replicas, a budget. It formats the number for the locale (currency, percent) and clamps it to `min`/`max`. For a value where the rough position matters more than the exact number, use a slider. For codes and IDs that only contain digits, use a text field.

## States

```tsx
<NumberField label="Seats" defaultValue={5} min={1} max={50} description="Billed per seat." />
<NumberField label="Replicas" defaultValue={0} min={1} error="Run at least 1 replica." />
<NumberField label="Locked" defaultValue={12} disabled />
```

## Currency and percent

`format` takes `Intl.NumberFormat` options. Pair a currency with `locale` so the separators and symbol are right.

```tsx
<NumberField label="Monthly budget" locale="vi-VN" format={{ style: 'currency', currency: 'VND' }} defaultValue={5_000_000} step={500_000} min={0} incrementLabel="Tăng" decrementLabel="Giảm" />
<NumberField label="Discount" format={{ style: 'percent' }} defaultValue={0.1} step={0.05} min={0} max={1} />
```

## Sizes

```tsx
<NumberField label="Small" defaultValue={2} size="sm" />
<NumberField label="Medium" defaultValue={2} />
<NumberField label="Large" defaultValue={2} size="lg" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required) |
| `value / defaultValue` | `number \| null` | – | Controlled or initial value |
| `onValueChange` | `(value: number \| null, details) => void` | – | Called as the value changes |
| `min / max` | `number` | – | Limits; the steppers disable at the ends |
| `step / largeStep` | `number` | `1 / 10` | Arrow keys and buttons step by step; Shift+Arrow by largeStep |
| `format / locale` | `Intl.NumberFormatOptions / string` | – | How the number is shown, e.g. VND currency |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |
| `decrementLabel / incrementLabel` | `string` | `'Decrease' / 'Increase'` | Accessible names of the − and + buttons |
| `description / error / optionalLabel` | `ReactNode` | – | Help text, an error that marks it invalid, and an "Optional" marker |
| `required / disabled / name` | `boolean / boolean / string` | – | Form semantics; the number is submitted under name |

Also takes `placeholder`, `ref` (the input), `className` (the stepper box) and other Base UI root props (`onValueCommitted`, `snapOnStep`, `allowWheelScrub`…).

## Accessibility

- The input is labelled by the field label and reads its help and error text.
- Arrow Up/Down step the value, Shift+Arrow takes a large step, Home and End jump to `min` and `max`.
- The − and + buttons have their own names and are left out of the Tab order, since the arrow keys do the same.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type NumberFieldProps = Omit<BaseUI.NumberField.Root.Props, 'className'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  /** Class for the stepper box. */
  className?: string;
  fieldClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  /** Ref to the text input. */
  ref?: Ref<HTMLInputElement>;
  /** Accessible names of the − and + buttons. Pass Vietnamese text in Vietnamese UIs. */
  decrementLabel?: string;
  incrementLabel?: string;
};
```
