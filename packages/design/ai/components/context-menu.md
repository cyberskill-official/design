# Context Menu

> A menu of actions for an area, opened by right click or long press at the pointer.

```tsx
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@cyberskill/design';
```

Use a context menu as a shortcut for actions on what is under the pointer: a file, a row, a card, a canvas. It is an enhancement: keyboard and screen reader users cannot open it, and touch users rarely look for it, so the same actions must also live in a visible menu button or toolbar.

## Area

```tsx
<ContextMenu>
  <ContextMenuTrigger className="file-card">…</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem icon={<PencilSimple />} shortcut="⌘R" onClick={rename}>Rename</ContextMenuItem>
    <ContextMenuItem icon={<Copy />} shortcut="⌘D">Duplicate</ContextMenuItem>
    <ContextMenuItem icon={<DownloadSimple />} disabled>Export transcript</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem icon={<Trash />} tone="danger">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

`ContextMenuTrigger` renders a `<div>` around your content and adds no styling of its own, except a focus ring while its menu is open. Pass `render` to use another element.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon (Item)` | `ReactNode` | – | Decorative icon before the label |
| `shortcut (Item)` | `ReactNode` | – | Shortcut hint shown at the end; display only, wire the keys yourself |
| `tone (Item)` | `'neutral' \| 'danger'` | `'neutral'` | Danger for destructive actions; put them last, after a separator |
| `disabled (Item)` | `boolean` | `false` | Shown dimmed and skipped by the arrow keys |
| `onClick (Item)` | `(event) => void` | – | Runs the action; the menu then closes |

`ContextMenu` takes `open`, `defaultOpen` and `onOpenChange`.

## Accessibility

- Opens at the pointer with focus in the menu. Arrow keys move between items, typing jumps to an item, Enter runs it.
- Escape or a click outside closes it, and focus returns to where it was.
- Items are `menuitem`s; disabled ones are announced as unavailable.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type ContextMenuProps = BaseUI.ContextMenu.Root.Props;
type ContextMenuContentProps = Omit<BaseUI.ContextMenu.Popup.Props, 'className'> & {
  className?: string;
};
type ContextMenuItemProps = Omit<BaseUI.ContextMenu.Item.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** Keyboard shortcut shown at the end, e.g. "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: ReactNode;
  /** `danger` for destructive actions such as Delete. */
  tone?: 'neutral' | 'danger';
};
type ContextMenuSeparatorProps = Omit<BaseUI.ContextMenu.Separator.Props, 'className'> & {
  className?: string;
};
type ContextMenuTriggerProps = Omit<BaseUI.ContextMenu.Trigger.Props, 'className'> & {
  className?: string;
};
```
