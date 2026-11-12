# Popover

> A small panel anchored to a button, for details or a short form that should not leave the page.

```tsx
import { Button, IconButton, Popover, PopoverContent, PopoverTrigger, TextField } from '@cyberskill/design';
```

Use a popover for content a user asks for: details behind an info button, a quick setting, a two-field form. It does not block the page. For a task the user must finish or cancel, use a dialog; for a few words on hover, a tooltip.

## Small form

```tsx
const [open, setOpen] = useState(false);

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger render={<Button variant="secondary" />}>Usage limits</PopoverTrigger>
  <PopoverContent title="Monthly limit" description="Agents pause when the workspace reaches this many messages.">
    <TextField label="Messages per month" type="number" defaultValue="20000" />
    <Button size="sm" onClick={() => setOpen(false)}>Save limit</Button>
  </PopoverContent>
</Popover>
```

## Details behind an info button

```tsx
<Popover>
  <PopoverTrigger render={<IconButton label="About message limits" icon={<Info />} variant="ghost" size="sm" />} />
  <PopoverContent side="right" title="What counts as a message?"
    description="Every reply an agent sends, including retries." />
</Popover>
```

Prefer this over a tooltip when the text matters: it opens on tap and is read by screen readers.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | – | Heading, announced when the popover opens (required) |
| `description` | `ReactNode` | – | Explanation under the title, announced with it |
| `closeLabel` | `string` | `'Close'` | Accessible name of the × button; pass a Vietnamese label in Vietnamese UIs |
| `side / align` | `'top' \| 'right' \| 'bottom' \| 'left' / 'start' \| 'center' \| 'end'` | `'bottom' / 'center'` | Where it opens; it flips when there is no room |

`Popover` takes `open`, `defaultOpen`, `onOpenChange` and `modal`. `PopoverTrigger` takes `render` and `openOnHover`.

## Accessibility

- Opens as a non-modal dialog named by its title and described by its description; focus moves inside.
- Escape, the × button or a click outside closes it, and focus returns to the trigger.
- Tab moves through the content; tabbing past the end closes it and continues on the page.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ButtonProps = Omit<BaseUI.Button.Props, 'className'> & {
  className?: string;
  /** Visual style. `accent` (gold) is for one key action or AI moment per view. `secondary` is a soft ink fill; `soft` is the same fill in any `tone`. */
  variant?: ButtonVariant;
  /** Tint of a `soft` button, e.g. `success` for Approve or `danger` for a quiet Remove. Ignored by other variants. */
  tone?: 'primary' | 'accent' | StatusTone;
  size?: ButtonSize;
  /** Shows a spinner, keeps the button focusable and announces it as busy. */
  loading?: boolean;
  /** Icon before the label (decorative). */
  iconStart?: ReactNode;
  /** Icon after the label (decorative). */
  iconEnd?: ReactNode;
  /** Stretch to the container width. */
  fullWidth?: boolean;
};
export type IconButtonProps = Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd' | 'fullWidth'> & {
  /** Accessible name, read by screen readers and shown as the tooltip-free label. Required. */
  label: string;
  icon: ReactNode;
};
export type PopoverProps = BaseUI.Popover.Root.Props;
export type PopoverContentProps = Omit<BaseUI.Popover.Popup.Props, 'className' | 'title'> & Pick<BaseUI.Popover.Positioner.Props, 'side' | 'align'> & {
  className?: string;
  /** Heading that names the popover, announced when it opens. */
  title: ReactNode;
  /** Short explanation under the title, announced with it. */
  description?: ReactNode;
  /** Accessible name of the close (×) button. Pass a Vietnamese string in Vietnamese UIs. */
  closeLabel?: string;
};
export type PopoverTriggerProps = Omit<BaseUI.Popover.Trigger.Props, 'className'> & {
  className?: string;
};
export type TextFieldProps = Omit<InputProps, 'children'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  fieldClassName?: string;
};
```
