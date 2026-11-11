# Menubar

> A desktop-app style row of menus (File, Edit, View) with submenus and shortcut hints.

```tsx
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSubmenu, MenubarSubmenuTrigger, MenubarTrigger } from '@cyberskill/design';
```

Use a menubar in app-like tools with many commands: editors, builders, consoles. Websites and most dashboards should use a [navigation menu](/docs/components/navigation-menu) or a toolbar instead; a menubar is unfamiliar outside desktop-style apps and hard to use on phones.

## Editor

```tsx
<Menubar aria-label="Agent editor">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem icon={<FilePlus />} shortcut="⌘N">New agent</MenubarItem>
      <MenubarSubmenu>
        <MenubarSubmenuTrigger>Export</MenubarSubmenuTrigger>
        <MenubarContent>
          <MenubarItem onClick={exportPdf}>PDF</MenubarItem>
          <MenubarItem>CSV</MenubarItem>
        </MenubarContent>
      </MenubarSubmenu>
      <MenubarSeparator />
      <MenubarItem icon={<Trash />} tone="danger">Delete agent</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>…</MenubarContent>
  </MenubarMenu>
</Menubar>
```

`MenubarContent` serves both top-level menus and submenus. `MenubarItem` and `MenubarSeparator` are the same components as the context menu's items.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label (Menubar)` | `string` | – | Names the bar for screen readers, e.g. "Agent editor" |
| `orientation (Menubar)` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the bar and its arrow keys |
| `disabled (MenubarMenu)` | `boolean` | `false` | Disables one menu |
| `icon / shortcut / tone (Item)` | `ReactNode / ReactNode / 'neutral' \| 'danger'` | – | As in Context Menu |
| `icon (SubmenuTrigger)` | `ReactNode` | – | Decorative icon before the label; a caret is added at the end |

## Accessibility

- The bar is a `menubar`; once a menu is open, Left and Right move between its menus.
- Inside a menu, Up and Down move between items, Right opens a submenu and Escape closes it. Escape on a top-level menu closes it and returns focus to its trigger.
- Shortcut hints are display only. Bind the keys in your app.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type MenubarProps = Omit<BaseUI.Menubar.Props, 'className'> & {
  className?: string;
};
type MenubarContentProps = Omit<BaseUI.Menu.Popup.Props, 'className'> & {
  className?: string;
};
type MenubarMenuProps = BaseUI.Menu.Root.Props;
type MenubarSubmenuProps = BaseUI.Menu.SubmenuRoot.Props;
type MenubarSubmenuTriggerProps = Omit<BaseUI.Menu.SubmenuTrigger.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
};
type MenubarTriggerProps = Omit<BaseUI.Menu.Trigger.Props, 'className'> & {
  className?: string;
};
```
