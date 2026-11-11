# Alert

> An inline message about a page or section, in four tones, with an optional action and dismiss button.

```tsx
import { Alert, Button } from '@cyberskill/design';
```

Use an alert for a message that belongs to the page and should stay until it is resolved or dismissed: a failed payment, a quota warning, planned maintenance. For a short confirmation of something the user just did, use a [toast](/docs/components/toast). For a field error, use the field's `error`.

## Tones

Every tone shows its icon and a title, so the meaning never rests on color alone.

```tsx
<Alert tone="info" title="Scheduled maintenance on Sunday" description="The dashboard is read-only from 01:00 to 03:00." />
<Alert tone="success" title="Domain verified" description="support.example.com is live." />
<Alert tone="warning" title="80% of monthly API calls used" description="Requests are throttled after 1M calls." />
<Alert tone="danger" title="Payment failed" description="The card ending 4242 was declined." />
```

## Action and dismiss

Put one next step in `action`. Pass `onDismiss` to show a close button; the alert does not hide itself, so remove it from your state.

```tsx
{open && (
  <Alert
    tone="danger"
    title="Payment failed"
    description="The card ending 4242 was declined."
    action={<Button size="sm" variant="secondary">Update card</Button>}
    onDismiss={() => setOpen(false)}
  />
)}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Icon, tint and live role |
| `title` | `ReactNode` | – | Short headline (required) |
| `description` | `ReactNode` | – | Detail under the title |
| `action` | `ReactNode` | – | Next step, e.g. a small Button or a link |
| `onDismiss` | `() => void` | – | Shows a close button that calls this |
| `dismissLabel` | `string` | `'Dismiss'` | Accessible name of the close button, e.g. "Đóng" |
| `role` | `string` | `from tone` | Override the live role, e.g. 'note' for a message present on page load |

All other `div` props pass through.

## Accessibility

- Info and success alerts use `role="status"` (read politely when they appear); warning and danger use `role="alert"` (read right away). Render the alert when the event happens so screen readers announce it.
- A message that is part of the page from the start does not need announcing: pass `role="note"`.
- The icon is decorative; the title carries the meaning. Title and body text meet 4.5:1 on every tint in light and dark.
- The dismiss button is a real button, reachable with Tab and named by `dismissLabel`.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  className?: string;
  tone?: AlertTone;
  /** Short headline, e.g. "Payment failed". */
  title: ReactNode;
  description?: ReactNode;
  /** Actions under the text, e.g. a small Button or a link. */
  action?: ReactNode;
  /** Shows a dismiss (×) button that calls this. */
  onDismiss?: () => void;
type ButtonProps = Omit<BaseUI.Button.Props, 'className'> & {
  className?: string;
  /** Visual style. `accent` (gold) is for one key action or AI moment per view. */
  variant?: ButtonVariant;
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
