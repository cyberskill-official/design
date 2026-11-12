# Dialog

> A modal panel for confirmations and short tasks. Focus is trapped and restored for you.

```tsx
import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, TextField } from '@cyberskill/design';
```

Use a dialog when the user must finish or dismiss something before going on: confirming a destructive action, a short form. For longer flows use a page; for non-blocking messages use a toast.

## Confirmation

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="secondary" />}>Delete project</DialogTrigger>
  <DialogContent size="sm" icon={<Trash />} tone="danger"
    title="Delete Support Copilot?"
    description="This removes the agent and all conversation history. This cannot be undone.">
    <TextField label="Type DELETE to confirm" />
    <DialogFooter>
      <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
      <Button variant="danger">Delete agent</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Form

```tsx
<DialogContent title="Invite people" description="They get an email with a link to join.">
  <TextField label="Work email" type="email" />
  <DialogFooter>…</DialogFooter>
</DialogContent>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | – | Heading, announced when the dialog opens (required) |
| `description` | `ReactNode` | – | Explanation under the title, announced with it |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 400, 520 or 720px wide |
| `icon / tone` | `ReactNode / 'neutral' \| 'danger' \| 'accent'` | `– / 'neutral'` | Icon badge beside the title |
| `closeLabel` | `string` | `'Close'` | Accessible name of the × button; pass a Vietnamese label in Vietnamese UIs |
| `hideClose` | `boolean` | `false` | Hide the × button (keep a Cancel button then) |

`Dialog` takes `open`, `defaultOpen` and `onOpenChange`. `DialogTrigger` and `DialogClose` take `render` to use a design-system `Button`.

## Accessibility

- Opens as a modal with its title and description announced; focus moves inside and returns to the trigger on close.
- Escape and the backdrop close it. Tab cycles inside the dialog.
- Put the primary action last in `DialogFooter`; for destructive actions, ask the user to confirm.

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
export type DialogProps = BaseUI.Dialog.Root.Props;
export type DialogCloseProps = Omit<BaseUI.Dialog.Close.Props, 'className'> & {
  className?: string;
};
export type DialogContentProps = Omit<BaseUI.Dialog.Popup.Props, 'className' | 'title'> & {
  className?: string;
  /** Heading of the dialog, announced when it opens. */
  title: ReactNode;
  /** Short explanation under the title, announced with it. */
  description?: ReactNode;
  /** `sm` 400px (confirmations), `md` 520px (forms), `lg` 720px (rich content). */
  size?: 'sm' | 'md' | 'lg';
  /** Icon badge beside the title; `tone` tints it. */
  icon?: ReactNode;
  tone?: 'neutral' | 'danger' | 'accent';
  /** Accessible name of the close (×) button. Pass a Vietnamese string in Vietnamese UIs. */
  closeLabel?: string;
  hideClose?: boolean;
};
export type DialogTriggerProps = Omit<BaseUI.Dialog.Trigger.Props, 'className'> & {
  className?: string;
};
export type TextFieldProps = Omit<InputProps, 'children'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
  fieldClassName?: string;
};
```
