# Alert Dialog

> A modal confirmation for destructive or irreversible actions. The backdrop does not dismiss it, and an async confirm shows a loading button until it finishes.

```tsx
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, Button } from '@cyberskill/design';
```

Use an alert dialog when the user must answer before going on: deleting, publishing, discarding unsaved work. It asks one question with two answers, Cancel and the action. For forms or richer content use a [dialog](/docs/components/dialog); for an undoable action, skip the question and offer Undo in a toast.

## Destructive

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="secondary" iconStart={<Trash />} />}>Delete agent</AlertDialogTrigger>
  <AlertDialogContent
    title="Delete Support Copilot?"
    description="This removes the agent and all conversation history. This cannot be undone."
    confirmLabel="Delete agent"
    onConfirm={() => api.deleteAgent(id)}
  />
</AlertDialog>
```

When `onConfirm` returns a promise, the confirm button shows a spinner, Cancel and Escape are disabled, and the dialog closes once the promise resolves. If it rejects, the dialog stays open so the user can retry; show the error yourself, for example in a toast.

## Neutral

```tsx
<AlertDialogContent tone="neutral" title="Publish to production?"
  description="Customers start talking to version 12 right away." confirmLabel="Publish" onConfirm={publish} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | – | The question, announced when it opens (required) |
| `description` | `ReactNode` | – | What happens on confirm, announced with the title |
| `tone` | `'danger' \| 'neutral'` | `'danger'` | Danger shows a warning icon and a red confirm button |
| `confirmLabel` | `string` | `'Confirm'` | Name the action ("Delete agent"), not "OK" |
| `cancelLabel` | `string` | `'Cancel'` | Pass a Vietnamese label in Vietnamese UIs |
| `onConfirm` | `() => void \| Promise<unknown>` | – | Runs on confirm; a promise keeps the dialog open and busy until it settles |
| `children` | `ReactNode` | – | Extra content between the description and the buttons |

`AlertDialog` takes `open`, `defaultOpen` and `onOpenChange`. `AlertDialogTrigger` takes `render` to use a design-system `Button`.

## Accessibility

- Opens with `role="alertdialog"`, its title and description announced. Focus starts on **Cancel**, the safe answer, and returns to the trigger on close.
- Escape closes it; a backdrop click does not. Tab cycles between the two buttons.
- While an async confirm runs, the confirm button is `aria-busy` and Cancel is disabled.
- On phones the buttons stack full width, with the action on top.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type AlertDialogProps = BaseUI.AlertDialog.Root.Props;
export type AlertDialogContentProps = Omit<BaseUI.AlertDialog.Popup.Props, 'className' | 'title'> & {
  className?: string;
  /** The question, announced when it opens: "Delete Support Copilot?". */
  title: ReactNode;
  /** What happens if the user confirms, announced with the title. */
  description?: ReactNode;
  /** `danger` (default) shows a warning icon and a red confirm button; `neutral` a primary one. */
  tone?: 'danger' | 'neutral';
  /** Label of the button that dismisses. Pass a Vietnamese string in Vietnamese UIs. */
  cancelLabel?: string;
  /** Label of the confirm button. Name the action ("Delete agent"), not "OK". */
  confirmLabel?: string;
  /**
   * Runs on confirm. Return a promise to keep the dialog open with a loading button until it settles:
   * it closes when the promise resolves and stays open when it rejects (show the error yourself).
   */
  onConfirm?: () => void | Promise<unknown>;
};
export type AlertDialogTriggerProps = Omit<BaseUI.AlertDialog.Trigger.Props, 'className'> & {
  className?: string;
};
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
```
