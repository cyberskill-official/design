# Drawer

> A panel that slides in from the side or the bottom, for secondary tasks that keep the page in view. Swipe to dismiss on touch screens.

```tsx
import { Button, Drawer, DrawerClose, DrawerContent, DrawerTrigger, TextField } from '@cyberskill/design';
```

Use a drawer for editing a record, filters, details or mobile navigation: tasks that benefit from keeping the page behind visible. Side sheets suit desktop; bottom sheets suit phones. For a short confirmation use an [alert dialog](/docs/components/alert-dialog); for a focused form, a [dialog](/docs/components/dialog).

## Side sheet

```tsx
<Drawer>
  <DrawerTrigger render={<Button variant="secondary" />}>Edit agent</DrawerTrigger>
  <DrawerContent
    title="Edit Support Copilot"
    description="Changes apply to new conversations."
    footer={<>
      <DrawerClose render={<Button variant="secondary" />}>Cancel</DrawerClose>
      <Button>Save changes</Button>
    </>}
  >
    <TextField label="Name" defaultValue="Support Copilot" />
  </DrawerContent>
</Drawer>
```

The body scrolls; the header and `footer` stay put.

## Left

```tsx
<Drawer side="left">
  <DrawerTrigger render={<Button variant="secondary" iconStart={<Faders />} />}>Filters</DrawerTrigger>
  <DrawerContent title="Filters" size="sm">…</DrawerContent>
</Drawer>
```

## Bottom sheet

```tsx
<Drawer side="bottom">
  <DrawerTrigger render={<Button variant="secondary" />}>Share</DrawerTrigger>
  <DrawerContent title="Share conversation" size="sm">…</DrawerContent>
</Drawer>
```

A bottom sheet shows a grab handle, rounds its top corners and keeps clear of the home indicator. Swipe it down to dismiss; side sheets dismiss with a swipe toward their edge.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `side (Drawer)` | `'right' \| 'left' \| 'bottom'` | `'right'` | Edge it slides in from; also sets the swipe-to-dismiss direction |
| `title` | `ReactNode` | – | Heading, announced when it opens (required) |
| `description` | `ReactNode` | – | Explanation under the title, announced with it |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Sides: 320, 400 or 560px wide. Bottom: up to 50, 75 or 92% of the screen height |
| `footer` | `ReactNode` | – | Pinned action row; put the primary action last |
| `closeLabel` | `string` | `'Close'` | Accessible name of the × button |

`Drawer` also takes `open`, `defaultOpen`, `onOpenChange` and `modal`. `DrawerTrigger` and `DrawerClose` take `render` to use a design-system `Button`.

## Accessibility

- Opens as a modal dialog named by its title; focus moves inside, is trapped, and returns to the trigger on close.
- Escape, the × button, a backdrop click or a swipe close it. Swiping is an extra, never the only way out.
- The grab handle is decorative and hidden from screen readers.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
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
type DrawerProps = Omit<BaseUI.Drawer.Root.Props, 'swipeDirection'> & {
  /** Edge the drawer slides in from; swiping back toward it dismisses. `bottom` is a mobile bottom sheet with a grab handle. */
  side?: DrawerSide;
};
type DrawerCloseProps = Omit<BaseUI.Drawer.Close.Props, 'className'> & {
  className?: string;
};
type DrawerContentProps = Omit<BaseUI.Drawer.Popup.Props, 'className' | 'title'> & {
  className?: string;
  /** Heading of the drawer, announced when it opens. */
  title: ReactNode;
  /** Short explanation under the title, announced with it. */
  description?: ReactNode;
  /** Side sheets: `sm` 320px, `md` 400px, `lg` 560px wide. Bottom sheets: at most 50%, 75% or 92% of the screen height. */
  size?: 'sm' | 'md' | 'lg';
  /** Action row pinned under the scrolling body, e.g. Cancel + Save. Put the primary action last. */
  footer?: ReactNode;
  /** Accessible name of the close (×) button. Pass a Vietnamese string in Vietnamese UIs. */
  closeLabel?: string;
};
type DrawerTriggerProps = Omit<BaseUI.Drawer.Trigger.Props, 'className'> & {
  className?: string;
};
type TextFieldProps, Textarea, type TextareaProps, type Theme, type ThemeScopeProps, type ToastOptions, type ToastProviderProps, type ToastTone, type ToggleProps, type ToolbarButtonProps, type ToolbarGroupProps, type ToolbarLinkProps, type ToolbarProps, type ToolbarSeparatorProps, type TooltipProps, type TooltipProviderProps };
```
