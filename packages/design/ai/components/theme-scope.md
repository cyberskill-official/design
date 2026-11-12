# Theme Scope

> Applies light or dark to one part of the page, including the menus, selects and dialogs opened from inside it.

```tsx
import { Button, Menu, MenuContent, MenuItem, MenuTrigger, SideNav, SideNavItem, ThemeScope } from '@cyberskill/design';
```

Use `ThemeScope` to give one region its own theme: a dark sidebar in a light app, a light preview inside a dark editor, a live example like the frames on this site. It sets `data-theme` on its own `div` **and** on the layer where popups render, so a menu, select, tooltip, popover or dialog opened from inside it wears the same theme. Plain `data-theme` on a container cannot do that, because popups render outside it, at the end of `<body>`.

For the whole page, skip it: set `data-theme="light"`, `"dark"` or `"system"` on `<html>`.

## Dark sidebar in a light page

Open the workspace menu: it renders outside the sidebar, yet it is dark too.

```tsx
<div className="app">
  <ThemeScope theme="dark" className="sidebar">
    <Menu>
      <MenuTrigger render={<Button variant="ghost" iconEnd={<CaretUpDown />} />}>Northwind</MenuTrigger>
      <MenuContent>
        <MenuItem icon={<Check />}>Northwind</MenuItem>
        <MenuItem>Contoso Support</MenuItem>
      </MenuContent>
    </Menu>
    <SideNav label="Main">
      <SideNavItem href="/" icon={<House />} active>Overview</SideNavItem>
      <SideNavItem href="/agents" icon={<Robot />}>Agents</SideNavItem>
    </SideNav>
  </ThemeScope>
  <main>…</main>
</div>
```

## Whole page

```tsx
// app/layout.tsx
<html lang="en" data-theme="system">
```

`system` follows the operating system's light or dark setting. A scope can sit inside a page theme, and scopes can nest; the nearest one wins.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `'light' \| 'dark' \| 'system'` | – | Theme of the region and of every popup opened from it (required) |
| `className` | `string` | – | Classes for the wrapping div |
| `…div attributes` | `HTMLAttributes<HTMLDivElement>` | – | style, id, aria-*, data-* and events go to the div |

The wrapper paints `var(--background)` and `var(--foreground)` for its theme, so text and surfaces flip with it. Give it layout styles (width, padding, grid) through `className` or `style`.

## Accessibility

- The scope is a plain `div` with no role; it adds nothing to the accessibility tree and keeps the reading and focus order of its children.
- Every token flips together, so contrast inside a scope meets the same 4.5:1 text and 3:1 control rules as a full-page theme.
- Popups keep their keyboard behavior: focus moves into a menu or dialog opened from the scope and returns to its trigger on close.
- Respect the user's preference for the page as a whole (`data-theme="system"`); use scopes for regions that are dark or light by design, not to override that choice.

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
export type MenuProps = BaseUI.Menu.Root.Props;
export type MenuContentProps = Omit<BaseUI.Menu.Popup.Props, 'className'> & Pick<BaseUI.Menu.Positioner.Props, 'side' | 'align' | 'sideOffset'> & {
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
export type MenuTriggerProps = Omit<BaseUI.Menu.Trigger.Props, 'className'> & {
  className?: string;
};
export type SideNavProps = HTMLAttributes<HTMLElement> & {
  className?: string;
  /** Accessible name of the landmark, e.g. "Main" / "Chính". */
  label: string;
};
export type SideNavItemProps = useRender.ComponentProps<'a'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** The current page: sets `aria-current="page"` and the highlighted style. */
  active?: boolean;
  /**
   * Plain text after the label, e.g. `12` or "New". It renders inside the link, so it is read as part of the
   * link's accessible name ("Conversations 12"): pass text, not a `Badge`, icon or anything interactive.
   */
  badge?: ReactNode;
};
export type ThemeScopeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** `light`, `dark`, or `system` (follows the operating system). */
  theme: Theme;
  className?: string;
};
```
