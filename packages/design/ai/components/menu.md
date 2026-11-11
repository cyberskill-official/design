# Menu

> A dropdown list of actions or options, opened from a button. Arrow keys, typeahead and focus return are handled for you.

```tsx
import { Button, IconButton, Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuSeparator, MenuTrigger } from '@cyberskill/design';
```

Use a menu for a short list of **actions** on one object (rename, duplicate, delete) or a few toggles. To pick a value for a form field, use a select; to navigate between pages, use links or a side nav.

## Actions

```tsx
<Menu>
  <MenuTrigger render={<Button variant="secondary" iconEnd={<CaretDown />} />}>Actions</MenuTrigger>
  <MenuContent>
    <MenuItem icon={<PencilSimple />} shortcut="⌘R" onClick={rename}>Rename</MenuItem>
    <MenuItem icon={<Copy />} shortcut="⌘D">Duplicate</MenuItem>
    <MenuItem icon={<Archive />} disabled>Archive</MenuItem>
    <MenuSeparator />
    <MenuItem icon={<Trash />} tone="danger">Delete agent</MenuItem>
  </MenuContent>
</Menu>
```

Put destructive items last, after a separator, with `tone="danger"`. If the action cannot be undone, open a confirmation dialog from it.

## Groups and checkbox items

```tsx
<Menu>
  <MenuTrigger render={<IconButton label="View options" icon={<DotsThree />} />} />
  <MenuContent align="end">
    <MenuGroup>
      <MenuGroupLabel>Columns</MenuGroupLabel>
      <MenuCheckboxItem defaultChecked>Owner</MenuCheckboxItem>
      <MenuCheckboxItem>Cost this month</MenuCheckboxItem>
    </MenuGroup>
  </MenuContent>
</Menu>
```

Checkbox items stay open on click so several can be toggled; use `checked` + `onCheckedChange` to control them.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `MenuContent side / align` | `'top' \| 'bottom' \| 'left' \| 'right' / 'start' \| 'center' \| 'end'` | `'bottom' / 'start'` | Where the menu opens; it flips when there is no room |
| `MenuContent sideOffset` | `number` | `6` | Gap between trigger and menu in px |
| `MenuItem icon` | `ReactNode` | – | Icon before the label (decorative) |
| `MenuItem shortcut` | `ReactNode` | – | Shortcut hint in a key style, e.g. "⌘D". Display only: wire the shortcut yourself |
| `MenuItem tone` | `'neutral' \| 'danger'` | `'neutral'` | Danger colors the item for destructive actions |
| `MenuItem disabled` | `boolean` | `false` | Skipped by clicks, still announced as unavailable |
| `MenuItem closeOnClick` | `boolean` | `true` | Set false to keep the menu open after the action |
| `MenuCheckboxItem checked / defaultChecked / onCheckedChange` | `boolean / boolean / (checked) => void` | – | Controlled or uncontrolled toggle |

`Menu` takes `open`, `defaultOpen`, `onOpenChange` and `modal`. `MenuTrigger` takes `render` to use a design-system `Button` or `IconButton`.

## Accessibility

- The trigger announces that it opens a menu and whether it is expanded.
- Enter, Space or Arrow Down opens the menu and focuses the first item; Arrow Up opens it on the last.
- Arrow keys move between items, Home and End jump to the ends, typing a letter jumps to the matching item.
- Escape or a click outside closes it and returns focus to the trigger.
- Group labels name their group; checkbox items announce checked or not checked.

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
type IconButtonProps = Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd' | 'fullWidth'> & {
  /** Accessible name, read by screen readers and shown as the tooltip-free label. Required. */
  label: string;
  icon: ReactNode;
};
type MenuProps = BaseUI.Menu.Root.Props;
type MenuCheckboxItemProps = Omit<BaseUI.Menu.CheckboxItem.Props, 'className'> & {
  className?: string;
};
type MenuContentProps = Omit<BaseUI.Menu.Popup.Props, 'className'> & Pick<BaseUI.Menu.Positioner.Props, 'side' | 'align' | 'sideOffset'> & {
  className?: string;
};
type MenuGroupProps = Omit<BaseUI.Menu.Group.Props, 'className'> & {
  className?: string;
};
type MenuGroupLabelProps = Omit<BaseUI.Menu.GroupLabel.Props, 'className'> & {
  className?: string;
};
type MenuItemProps = Omit<BaseUI.Menu.Item.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** Keyboard shortcut shown at the end, e.g. "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: ReactNode;
  /** `danger` for destructive actions such as Delete. */
  tone?: 'neutral' | 'danger';
};
type MenuSeparatorProps = Omit<BaseUI.Menu.Separator.Props, 'className'> & {
  className?: string;
};
type MenuTriggerProps = Omit<BaseUI.Menu.Trigger.Props, 'className'> & {
  className?: string;
};
```
