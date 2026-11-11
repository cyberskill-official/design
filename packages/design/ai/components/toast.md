# Toast

> A short, temporary message after an action, with an optional Undo. Stacks at the bottom-right.

```tsx
import { ToastProvider, useToast } from '@cyberskill/design';
```

Use a toast to confirm something the user just did ("Changes saved") or to report a background result ("Export ready"), optionally with one quick action such as Undo. Toasts disappear on their own, so never put the only copy of important information or a required decision in one: use an [alert](/docs/components/alert) or a [dialog](/docs/components/dialog).

## Setup

Wrap the app once in `ToastProvider`. It renders the stack: bottom-right on desktop, full width at the bottom on phones, clear of the safe-area insets.

```tsx
// app/layout.tsx (client boundary)
<ToastProvider>{children}</ToastProvider>
```

## Showing toasts

`useToast()` returns `toast(options)`, which shows a toast and returns its id, and `dismiss(id?)`.

```tsx
const { toast } = useToast();

toast({ tone: 'success', title: 'Changes saved' });
toast({ tone: 'danger', title: 'Payment failed', description: 'The card ending 4242 was declined.', timeout: 0 });
toast({
  tone: 'success',
  title: 'Project archived',
  action: { label: 'Undo', onClick: restoreProject },
  timeout: 8000,
});
```

## Props

`toast(options)`:

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | – | Short message (required) |
| `description` | `ReactNode` | – | One line of detail |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Icon and accent color |
| `action` | `{ label, onClick }` | – | One action button; clicking it runs onClick and closes the toast |
| `timeout` | `number` | `5000` | Milliseconds before it closes; 0 keeps it open. Paused on hover and focus |
| `priority` | `'low' \| 'high'` | `'low'` | 'high' announces it immediately; keep it for errors |
| `id` | `string` | – | Reuse an id to update a toast in place |

`ToastProvider`:

| Prop | Type | Default | Description |
|---|---|---|---|
| `closeLabel` | `string` | `'Close'` | Accessible name of each close button, e.g. "Đóng" |
| `viewportLabel` | `string` | `'Notifications'` | Name of the notifications region, e.g. "Thông báo" |
| `limit` | `number` | `3` | Toasts shown at once; older ones are hidden |
| `timeout` | `number` | `5000` | Default timeout for every toast |

## Accessibility

- Toasts live in a polite live region, so screen readers read them without moving focus. `priority: 'high'` reads them right away.
- <kbd>F6</kbd> moves focus into the stack; <kbd>Tab</kbd> reaches each toast's action and close button, <kbd>Esc</kbd> closes the focused toast.
- Timers pause while the stack is hovered or focused, so there is time to read and act. Use `timeout: 0` for errors that need a decision.
- Every toast shows its tone icon and a text title, never color alone. Toasts can also be swiped away on touch screens.

## Exact types

```ts
type ToastProviderProps = Toast.Provider.Props & {
  /** Accessible name of each toast's close (×) button. */
  closeLabel?: string;
  /** Accessible name of the notifications region (reached with F6). */
  viewportLabel?: string;
};
```
