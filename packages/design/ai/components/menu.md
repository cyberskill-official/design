# Menu

> A dropdown list of actions or options, opened from a button. Arrow keys, typeahead and focus return are handled for you.

```tsx
import { Button, IconButton, Link, Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuLinkItem, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuSubmenu, MenuSubmenuTrigger, MenuTrigger } from '@cyberskill/design';
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

## Submenus, radio items and links

A `MenuSubmenu` holds a `MenuSubmenuTrigger` and its own `MenuContent`, which opens to the side. `MenuRadioGroup` picks one value among its `MenuRadioItem`s, marked with a check. `MenuLinkItem` navigates: give it `href`, or `render={<Link href="…" />}` for a Next.js or router link. It closes the menu on click.

```tsx
const [sort, setSort] = useState('updated');

<Menu>
  <MenuTrigger render={<Button variant="secondary" iconEnd={<CaretDown />} />}>View</MenuTrigger>
  <MenuContent>
    <MenuSubmenu>
      <MenuSubmenuTrigger icon={<ArrowsDownUp />}>Sort by</MenuSubmenuTrigger>
      <MenuContent>
        <MenuRadioGroup value={sort} onValueChange={setSort}>
          <MenuRadioItem value="name">Name</MenuRadioItem>
          <MenuRadioItem value="updated">Last updated</MenuRadioItem>
          <MenuRadioItem value="cost">Cost this month</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </MenuSubmenu>
    <MenuSeparator />
    <MenuLinkItem icon={<Gear />} render={<Link href="/settings" />}>Settings</MenuLinkItem>
    <MenuLinkItem icon={<Question />} href="https://help.example.com">Help center</MenuLinkItem>
  </MenuContent>
</Menu>
```

Keep submenus one level deep; past that, a dialog or a page reads better.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `MenuContent side / align` | `'top' \| 'bottom' \| 'left' \| 'right' / 'start' \| 'center' \| 'end'` | `'bottom' (beside a submenu trigger) / 'start'` | Where the menu opens; it flips when there is no room |
| `MenuContent sideOffset` | `number \| (data) => number` | `6 (−4 beside a submenu trigger)` | Gap between trigger and menu in px |
| `MenuItem icon` | `ReactNode` | – | Icon before the label (decorative) |
| `MenuItem shortcut` | `ReactNode` | – | Shortcut hint in a key style, e.g. "⌘D". Display only: wire the shortcut yourself |
| `MenuItem tone` | `'neutral' \| 'danger'` | `'neutral'` | Danger colors the item for destructive actions |
| `MenuItem disabled` | `boolean` | `false` | Skipped by clicks, still announced as unavailable |
| `MenuItem closeOnClick` | `boolean` | `true` | Set false to keep the menu open after the action |
| `MenuCheckboxItem checked / defaultChecked / onCheckedChange` | `boolean / boolean / (checked) => void` | – | Controlled or uncontrolled toggle |
| `MenuRadioGroup value / defaultValue / onValueChange` | `any / any / (value, details) => void` | – | The chosen MenuRadioItem value, controlled or uncontrolled |
| `MenuRadioItem value` | `any` | – | Value set on the group when chosen (required). Stays open on click |
| `MenuLinkItem href / render` | `string / ReactElement` | – | Where it goes; render={<Link />} for a router link |
| `MenuLinkItem icon / closeOnClick` | `ReactNode / boolean` | `– / true` | Decorative icon; set closeOnClick false to keep the menu open |
| `MenuSubmenuTrigger icon / openOnHover / delay` | `ReactNode / boolean / number` | `– / true / 100` | Decorative icon; hover opening and its delay in ms |
| `MenuSubmenu open / defaultOpen / onOpenChange` | `boolean / boolean / (open) => void` | – | Controlled or uncontrolled submenu |

`Menu` takes `open`, `defaultOpen`, `onOpenChange` and `modal`. `MenuTrigger` takes `render` to use a design-system `Button` or `IconButton`.

## Accessibility

- The trigger announces that it opens a menu and whether it is expanded.
- Enter, Space or Arrow Down opens the menu and focuses the first item; Arrow Up opens it on the last.
- Arrow keys move between items, Home and End jump to the ends, typing a letter jumps to the matching item.
- Escape or a click outside closes it and returns focus to the trigger.
- Group labels name their group; checkbox and radio items announce checked or not checked.
- A submenu trigger announces that it opens a menu. Arrow Right or Enter opens the submenu and focuses its first item; Arrow Left or Escape closes it and returns to the trigger. It also opens on hover.
- Link items are real `<a>` elements with the `menuitem` role, so the browser's link handling (open in new tab, status bar URL) still works.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ButtonProps = Omit<BaseUI.Button.Props, 'className'> & {
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
export type IconButtonProps = Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd' | 'fullWidth'> & {
  /** Accessible name, read by screen readers and shown as the tooltip-free label. Required. */
  label: string;
  icon: ReactNode;
};
export type LinkProps = useRender.ComponentProps<'a'> & {
  /** `default` ink, `muted` for secondary links (footers, meta lines). */
  tone?: 'default' | 'muted';
  /** Opens in a new tab: adds `target="_blank"`, `rel="noopener noreferrer"`, an icon and screen-reader text. */
  external?: boolean;
  /** Screen-reader text for external links. Pass a Vietnamese string in Vietnamese UIs. */
  externalLabel?: string;
};
export type MenuProps = BaseUI.Menu.Root.Props;
export type MenuCheckboxItemProps = Omit<BaseUI.Menu.CheckboxItem.Props, 'className'> & {
  className?: string;
};
export type MenuContentProps = Omit<BaseUI.Menu.Popup.Props, 'className'> & Pick<BaseUI.Menu.Positioner.Props, 'side' | 'align' | 'sideOffset'> & {
  className?: string;
};
export type MenuGroupProps = Omit<BaseUI.Menu.Group.Props, 'className'> & {
  className?: string;
};
export type MenuGroupLabelProps = Omit<BaseUI.Menu.GroupLabel.Props, 'className'> & {
  className?: string;
};
export type MenuItemProps = Omit<BaseUI.Menu.Item.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** Keyboard shortcut shown at the end, e.g. "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: ReactNode;
  /** `danger` for destructive actions such as Delete. */
  tone?: 'neutral' | 'danger';
};
export type MenuLinkItemProps = Omit<BaseUI.Menu.LinkItem.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
};
export type MenuRadioGroupProps = Omit<BaseUI.Menu.RadioGroup.Props, 'className'> & {
  className?: string;
};
export type MenuRadioItemProps = Omit<BaseUI.Menu.RadioItem.Props, 'className'> & {
  className?: string;
};
export type MenuSeparatorProps = Omit<BaseUI.Menu.Separator.Props, 'className'> & {
  className?: string;
};
export type MenuSubmenuProps = BaseUI.Menu.SubmenuRoot.Props;
export type MenuSubmenuTriggerProps = Omit<BaseUI.Menu.SubmenuTrigger.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
};
export type MenuTriggerProps = Omit<BaseUI.Menu.Trigger.Props, 'className'> & {
  className?: string;
};
```
