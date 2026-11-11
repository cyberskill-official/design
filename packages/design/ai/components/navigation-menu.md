# Navigation Menu

> Website header navigation with dropdown panels of link cards. Marks the current page and hands narrow screens over to a drawer.

```tsx
import { Drawer, DrawerContent, DrawerTrigger, IconButton, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuLinkCard, NavigationMenuTrigger } from '@cyberskill/design';
```

Use a navigation menu for a site or product header: a few top-level links, some of which open a panel of related pages. It navigates; for actions use a [menu](/docs/components/menu), for app commands a [menubar](/docs/components/menubar).

## Mega menu

```tsx
<NavigationMenu aria-label="Main">
  <NavigationMenuItem>
    <NavigationMenuTrigger>Product</NavigationMenuTrigger>
    <NavigationMenuContent>
      <NavigationMenuLinkCard href="/agents" icon={<Robot />} title="Agents"
        description="Build, train and publish support agents." active />
      <NavigationMenuLinkCard href="/inbox" icon={<ChatsCircle />} title="Inbox"
        description="Hand conversations over to your team." />
    </NavigationMenuContent>
  </NavigationMenuItem>
  <NavigationMenuItem>
    <NavigationMenuLink href="/pricing" active={pathname === '/pricing'}>Pricing</NavigationMenuLink>
  </NavigationMenuItem>
</NavigationMenu>
```

Panels lay link cards out in `columns` (1, 2 or 3; default 2) and drop to one column on phones. For client-side routing pass your router's link: `render={<NextLink href="/pricing" />}`.

## Narrow screens

Below about 768px, hide the navigation menu and show a menu button that opens the same links in a left [drawer](/docs/components/drawer). Until then the bar scrolls sideways instead of wrapping.

```tsx
<header>
  <NavigationMenu aria-label="Main" className="nav-desktop">…</NavigationMenu>
  <Drawer side="left">
    <DrawerTrigger render={<IconButton label="Open menu" icon={<List />} className="nav-mobile" />} />
    <DrawerContent title="Menu" size="sm">
      <nav aria-label="Main">{/* the same links, as full-width ghost buttons rendering <a> */}</nav>
    </DrawerContent>
  </Drawer>
</header>
```

```css
.nav-mobile { display: none; }
@media (max-width: 767px) { .nav-desktop { display: none; } .nav-mobile { display: inline-flex; } }
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label (NavigationMenu)` | `string` | – | Names the <nav>, e.g. "Main" |
| `delay / closeDelay (NavigationMenu)` | `number` | `50 / 50` | Hover delays in ms before a panel opens or closes |
| `columns (Content)` | `1 \| 2 \| 3` | `2` | Columns of link cards on wide screens |
| `title / description / icon (LinkCard)` | `ReactNode` | – | Card text and a decorative icon tile |
| `active (Link, LinkCard)` | `boolean` | `false` | Marks the current page with aria-current="page" |
| `render (Link, LinkCard)` | `ReactElement` | `<a>` | Your router's link component |

## Accessibility

- Renders a `<nav>` landmark; give it an `aria-label`. Triggers are buttons with `aria-expanded`.
- Tab moves through triggers and links; Enter or Space opens a panel and Tab continues into its links. Escape closes it and focus returns to the trigger.
- The current page is announced via `aria-current="page"` and shown in the soft primary color.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type DrawerProps = Omit<BaseUI.Drawer.Root.Props, 'swipeDirection'> & {
  /** Edge the drawer slides in from; swiping back toward it dismisses. `bottom` is a mobile bottom sheet with a grab handle. */
  side?: DrawerSide;
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
type IconButtonProps = Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd' | 'fullWidth'> & {
  /** Accessible name, read by screen readers and shown as the tooltip-free label. Required. */
  label: string;
  icon: ReactNode;
};
type NavigationMenuProps = Omit<BaseUI.NavigationMenu.Root.Props, 'className'> & {
  className?: string;
};
type NavigationMenuContentProps = Omit<BaseUI.NavigationMenu.Content.Props, 'className'> & {
  className?: string;
  /** Columns of link cards on wide screens; always one column on phones. */
  columns?: 1 | 2 | 3;
};
type NavigationMenuItemProps = Omit<BaseUI.NavigationMenu.Item.Props, 'className'> & {
  className?: string;
};
type NavigationMenuLinkProps = Omit<BaseUI.NavigationMenu.Link.Props, 'className'> & {
  className?: string;
};
type NavigationMenuLinkCardProps = Omit<BaseUI.NavigationMenu.Link.Props, 'className' | 'title'> & {
  className?: string;
  /** Destination name, e.g. "Agents". */
  title: ReactNode;
  /** One line on what is there. */
  description?: ReactNode;
  /** Decorative icon in a tile before the text. */
  icon?: ReactNode;
};
type NavigationMenuTriggerProps = Omit<BaseUI.NavigationMenu.Trigger.Props, 'className'> & {
  className?: string;
};
```
