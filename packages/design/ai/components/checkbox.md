# Checkbox

> Turn an option on or off, alone or in a labelled group, with an optional mixed state.

```tsx
import { Checkbox, CheckboxGroup } from '@cyberskill/design';
```

Use a checkbox for a choice that is saved with a form: accepting terms, opting into emails, picking several options from a list. For a setting that applies at once, use a switch. For exactly one choice from a list, use a radio group.

## States

```tsx
<Checkbox label="Email me a weekly summary" description="Sent on Mondays at 9:00." />
<Checkbox label="Remember this device" defaultChecked />
<Checkbox label="Select all" indeterminate />
<Checkbox label="Managed by your admin" disabled defaultChecked />
<Checkbox label="I accept the terms of service" error="Accept the terms to continue." />
```

## Group

`CheckboxGroup` gives the options a shared label and holds the checked values as an array.

```tsx
<CheckboxGroup label="Notify me about" description="Applies to every workspace you belong to." defaultValue={['mentions', 'replies']}>
  <Checkbox value="mentions" label="Mentions" />
  <Checkbox value="replies" label="Replies" description="Only in threads you follow." />
  <Checkbox value="deploys" label="Failed deploys" />
  <Checkbox value="billing" label="Billing changes" disabled />
</CheckboxGroup>
```

## Select all

A `parent` checkbox checks or clears every option and shows the mixed state when only some are checked. Pass every option value to `allValues` and control the group.

```tsx
const [value, setValue] = useState<string[]>(['eu-central-1']);
<CheckboxGroup label="Replicate to" value={value} onValueChange={setValue} allValues={regions}>
  <Checkbox parent label="All regions" />
  {regions.map((r) => <Checkbox key={r} value={r} label={r} />)}
</CheckboxGroup>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label beside the box (required). Clicking it toggles the box |
| `description` | `ReactNode` | – | Help text under the label, announced with it |
| `error` | `ReactNode` | – | Standalone checkbox only: marks it invalid and shows the message |
| `checked / defaultChecked` | `boolean` | – | Controlled or initial state |
| `onCheckedChange` | `(checked, details) => void` | – | Called when the user toggles it |
| `indeterminate` | `boolean` | `false` | Mixed state, announced as "mixed" |
| `value` | `string` | – | Identifies the option inside a CheckboxGroup |
| `parent` | `boolean` | `false` | Makes it the select-all box of its group |

`CheckboxGroup` takes `label` (required), `description`, `error`, `name`, `value` / `defaultValue` / `onValueChange` (arrays of option values), `allValues` and `disabled`. `className` goes on the row; `ref` and the rest go to the box.

## Accessibility

- Each box is named by its label and described by its help text; the group is named by its label.
- Tab moves to each box, Space toggles it. Clicking the label toggles too.
- The box has a 44px touch area around its 18px square.
- Checked and mixed states differ by shape (check or dash), not only by color.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type CheckboxProps = Omit<BaseUI.Checkbox.Root.Props, 'className' | 'children'> & {
  /** Class for the row (box + label + description). */
  className?: string;
  /** Visible label beside the box. Clicking it toggles the checkbox. */
  label: ReactNode;
  /** Help text under the label, announced with it. */
  description?: ReactNode;
  /** Error message for a standalone checkbox (e.g. "Accept the terms to continue"). Marks it invalid. */
  error?: ReactNode;
};
export type CheckboxGroupProps = Omit<BaseUI.CheckboxGroup.Props, 'className'> & {
  className?: string;
  /** Visible group label (rendered as the fieldset legend). */
  label: ReactNode;
  /** Help text under the group label. */
  description?: ReactNode;
  /** Error message for the whole group (e.g. "Pick at least one channel"). Marks it invalid. */
  error?: ReactNode;
  /** Form field name; the checked option values are submitted under it. */
  name?: string;
  /** `Checkbox` options, each with its own `value`. */
  children: ReactNode;
};
```
