# Radio group

> Pick exactly one option from a short list that stays visible.

```tsx
import { Radio, RadioGroup } from '@cyberskill/design';
```

Use a radio group when people must pick one of 2 to 6 options and should see them all to compare, often with a line of help under each. For longer lists use a select; to switch views of the same content use a segmented control.

## Basic

```tsx
<RadioGroup label="Billing cycle" description="You can switch at the next renewal." defaultValue="monthly">
  <Radio value="monthly" label="Monthly" description="Billed on the 1st of each month." />
  <Radio value="yearly" label="Yearly" description="Two months free, billed once a year." />
  <Radio value="custom" label="Custom contract" disabled />
</RadioGroup>
```

## Error

```tsx
<RadioGroup label="Data residency" error="Choose where your data is stored.">
  <Radio value="sg" label="Singapore" />
  <Radio value="fra" label="Frankfurt" />
</RadioGroup>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible group label (required) |
| `description` | `ReactNode` | – | Help text under the group label |
| `error` | `ReactNode` | – | Marks the group invalid and shows the message |
| `value / defaultValue` | `Value` | – | Controlled or initial selected value |
| `onValueChange` | `(value, details) => void` | – | Called when the selection changes |
| `name / required / disabled` | `string / boolean / boolean` | – | Form semantics |

`Radio` takes `value` (required), `label` (required), `description` and `disabled`.

## Accessibility

- The group is a radiogroup named by its label; each option is named by its label and described by its help text.
- Tab enters the group on the selected option. Arrow keys move and select; disabled options are skipped.
- Each dot has a 44px touch area, and clicking the label selects the option.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type RadioProps<Value = string> = Omit<BaseUI.Radio.Root.Props<Value>, 'className' | 'children'> & {
  /** Class for the row (dot + label + description). */
  className?: string;
  /** Visible label beside the dot. Clicking it selects the option. */
  label: ReactNode;
  /** Help text under the label, announced with it. */
  description?: ReactNode;
};
export type RadioGroupProps<Value = string> = Omit<BaseUI.RadioGroup.Props<Value>, 'className'> & {
  className?: string;
  /** Visible group label (rendered as the fieldset legend). */
  label: ReactNode;
  /** Help text under the group label. */
  description?: ReactNode;
  /** Error message for the group (e.g. "Choose a billing cycle"). Marks it invalid. */
  error?: ReactNode;
  /** `Radio` options. */
  children: ReactNode;
};
```
