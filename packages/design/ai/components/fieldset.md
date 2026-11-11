# Fieldset

> Groups related fields under one legend and optional help text.

```tsx
import { Fieldset, TextField } from '@cyberskill/design';
```

Use a fieldset when several fields answer one question or belong to one topic: an address, a contact, a set of notification channels. A single field does not need one.

## Example

```tsx
<Fieldset legend="Billing address" description="Printed on every invoice.">
  <TextField label="Company" name="company" />
  <TextField label="Tax code" name="taxCode" />
  <TextField label="Address" name="address" />
</Fieldset>
```

## Disabled

`disabled` disables every control inside at once.

```tsx
<Fieldset legend="Single sign-on" description="Available on the Enterprise plan." disabled>
  <TextField label="Identity provider URL" name="idpUrl" />
</Fieldset>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `legend` | `ReactNode` | – | Heading of the group, read as its name (required) |
| `description` | `ReactNode` | – | Help text under the legend, read as its description |
| `disabled` | `boolean` | `false` | Disables every control inside |

## Accessibility

- Renders a native `fieldset`, named by the legend, so screen readers announce "Billing address, group" when focus enters.
- The description is linked with `aria-describedby`.
- Each field inside still needs its own label.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type FieldsetProps = Omit<BaseUI.Fieldset.Root.Props, 'className'> & {
  className?: string;
  /** Heading of the group, read as the group's name. */
  legend: ReactNode;
  /** Help text under the legend, read as the group's description. */
  description?: ReactNode;
};
type TextFieldProps, Textarea, type TextareaProps, type Theme, type ThemeScopeProps, type ToastOptions, type ToastProviderProps, type ToastTone, type ToggleProps, type ToolbarButtonProps, type ToolbarGroupProps, type ToolbarLinkProps, type ToolbarProps, type ToolbarSeparatorProps, type TooltipProps, type TooltipProviderProps };
```
