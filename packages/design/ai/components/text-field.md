# Text field

> Single and multi-line text input with label, help text, errors and adornments.

```tsx
import { Input, TextField, Textarea } from '@cyberskill/design';
```

`TextField` is the common case: a labelled input with optional help and error text. Use `Field` + `Input` when you need a custom layout, and `Textarea` for multi-line text. Every field has a visible label; placeholder text is a hint, never the label.

## States

```tsx
<TextField label="Work email" type="email" description="We only use it for sign-in and billing notices." />
<TextField label="API key name" error="Use letters, numbers and dashes only." />
<TextField label="Company" optionalLabel="Optional" />
<TextField label="Plan" defaultValue="Business" disabled />
```

## Adornments

```tsx
<TextField label="Workspace address" startAdornment="https://" endAdornment=".cyberskill.world" />
<Input aria-label="Search" startAdornment={<MagnifyingGlass aria-hidden />} endAdornment="⌘K" />
```

## Multi-line

```tsx
<Textarea label="Instructions for the agent" description="142 of 2,000 characters" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required). Use hideLabel only when the context labels it visually |
| `description` | `ReactNode` | – | Help text, announced with the input |
| `error` | `ReactNode` | – | Marks the field invalid and shows the message. Works with any form library |
| `optionalLabel` | `ReactNode` | – | e.g. "Optional" / "Không bắt buộc", shown after the label |
| `startAdornment / endAdornment` | `ReactNode` | – | Prefix or suffix inside the box |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |

All native input props (`type`, `name`, `value`, `onChange`, `autoComplete`…) pass through.

## Accessibility

- The label, help text and error are linked to the input, so screen readers read all three.
- Errors set `aria-invalid` and use text plus color, never color alone.
- Focus shows a 3px ring in the primary color, visible on both themes.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type InputProps = Omit<BaseUI.Input.Props, 'className' | 'size'> & {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Content inside the box before the text, e.g. an icon or "https://". */
  startAdornment?: ReactNode;
  /** Content inside the box after the text, e.g. a unit, ".cyberskill.world" or a shortcut hint. */
  endAdornment?: ReactNode;
};
export type TextFieldProps = Omit<InputProps, 'children'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  fieldClassName?: string;
};
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  fieldClassName?: string;
  className?: string;
};
```
