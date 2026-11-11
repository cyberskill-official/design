# Side nav

> Vertical app navigation with icons, section labels, counts and a clear current page.

```tsx
import { Link, SideNav, SideNavGroup, SideNavItem } from '@cyberskill/design';
```

Use a side nav for the main sections of an app. Every item is a real link to a page. For switching views of one object inside a page, use [tabs](/docs/components/tabs).

## Navigation

```tsx
<SideNav label="Main">
  <SideNavItem href="/" icon={<House />}>Overview</SideNavItem>
  <SideNavGroup label="Build">
    <SideNavItem href="/agents" icon={<Robot />} active>Agents</SideNavItem>
    <SideNavItem href="/sources" icon={<Database />}>Training sources</SideNavItem>
    <SideNavItem href="/conversations" icon={<ChatCircle />} badge={12}>Conversations</SideNavItem>
  </SideNavGroup>
</SideNav>
```

## With Next.js links

```tsx
import Link from 'next/link';

<SideNavItem render={<Link href="/agents" />} icon={<Robot />} active={pathname.startsWith('/agents')}>
  Agents
</SideNavItem>
```

`render` swaps the `<a>` for your router's link; class, `aria-current` and handlers are merged onto it.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `SideNav label` | `string` | – | Name of the navigation landmark, e.g. "Main" (required) |
| `SideNavGroup label` | `ReactNode` | – | Visible section heading; also names its list (required) |
| `SideNavItem href` | `string` | – | Where the link goes |
| `SideNavItem icon` | `ReactNode` | – | Icon before the label (decorative) |
| `SideNavItem active` | `boolean` | `false` | The current page: aria-current="page" and the highlighted style |
| `SideNavItem badge` | `ReactNode` | – | Count or status after the label, read as part of the link name |
| `SideNavItem render` | `ReactElement` | – | Render as another component, e.g. a router Link |

## Accessibility

- A `nav` landmark named by `label`, with lists so screen readers announce how many items each section has.
- The current page has `aria-current="page"`, shown with a tinted background, primary text and bold weight, not color alone.
- Items are plain links: Tab moves between them and Enter follows them. Items grow to 44px on touch screens.

## Exact types

```ts
type LinkProps = useRender.ComponentProps<'a'> & {
  /** `default` ink, `muted` for secondary links (footers, meta lines). */
  tone?: 'default' | 'muted';
  /** Opens in a new tab: adds `target="_blank"`, `rel="noopener noreferrer"`, an icon and screen-reader text. */
  external?: boolean;
  /** Screen-reader text for external links. Pass a Vietnamese string in Vietnamese UIs. */
  externalLabel?: string;
};
type SideNavProps = HTMLAttributes<HTMLElement> & {
  className?: string;
  /** Accessible name of the landmark, e.g. "Main" / "Chính". */
  label: string;
};
type SideNavGroupProps = HTMLAttributes<HTMLLIElement> & {
  className?: string;
  /** Visible heading of the section; also names its list for screen readers. */
  label: ReactNode;
};
type SideNavItemProps = useRender.ComponentProps<'a'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** The current page: sets `aria-current="page"` and the highlighted style. */
  active?: boolean;
  /** Count or status after the label, e.g. `12` or a Badge. Read as part of the link name. */
  badge?: ReactNode;
};
```
