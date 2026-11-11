# Breadcrumbs

> Shows where the current page sits in the hierarchy, with a link to each level above it.

```tsx
import { Breadcrumbs, Link } from '@cyberskill/design';
```

Use breadcrumbs on pages two or more levels deep (workspace → agents → an agent → its sources), above the page title. They help people go up a level; they do not replace the main navigation. Skip them on top-level pages.

## From items

```tsx
<Breadcrumbs
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Agents', href: '/agents' },
    { label: 'Support Copilot', href: '/agents/support' },
    { label: 'Training sources' },
  ]}
/>
```

The last item is the current page and gets `aria-current="page"`. Give it an `href` to keep it a link, or leave it out for plain text.

## Your own links

```tsx
<Breadcrumbs label="Đường dẫn">
  <Link href="/">Không gian làm việc</Link>
  <Link href="/billing">Thanh toán</Link>
  <Link href="/billing/invoices" aria-current="page">Hoá đơn</Link>
</Breadcrumbs>
```

Pass children instead of `items` to use your router's `Link`. Each child becomes one crumb; mark the current one yourself.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `{ label: ReactNode; href?: string }[]` | – | The trail, top level first. The last item is the current page |
| `children` | `ReactNode` | – | Instead of items: one link per crumb |
| `label` | `string` | `'Breadcrumb'` | Name of the navigation landmark; pass "Đường dẫn" in Vietnamese UIs |

## Accessibility

- Renders a `nav` landmark named by `label` with an ordered list, so screen readers announce "Breadcrumb, navigation, list, 4 items".
- The current page carries `aria-current="page"`.
- The caret separators are hidden from assistive tech.

## Exact types

```ts
type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  className?: string;
  /** The trail from the top level to the current page. The last item is the current page. */
  items?: BreadcrumbItem[];
  /** Instead of `items`: your own links (e.g. Next.js `Link`), one per crumb. Put `aria-current="page"` on the last. */
  children?: ReactNode;
  /** Accessible name of the landmark. Pass "Đường dẫn" in Vietnamese UIs. */
  label?: string;
};
type LinkProps = useRender.ComponentProps<'a'> & {
  /** `default` ink, `muted` for secondary links (footers, meta lines). */
  tone?: 'default' | 'muted';
  /** Opens in a new tab: adds `target="_blank"`, `rel="noopener noreferrer"`, an icon and screen-reader text. */
  external?: boolean;
  /** Screen-reader text for external links. Pass a Vietnamese string in Vietnamese UIs. */
  externalLabel?: string;
};
```
