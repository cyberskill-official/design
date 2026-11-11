# Link

> Underlined text link with a muted tone, external links and router support.

```tsx
import { Link } from '@cyberskill/design';
```

Use a link when the click only navigates. If it changes something (save, delete, open a dialog), use a Button; `Button variant="link"` looks like a link but acts like a button.

## In text

Links are always underlined, so they never rely on color. `tone="muted"` is for secondary links in footers and meta lines. `external` opens a new tab, adds an arrow icon and tells screen readers.

```tsx
<p>
  Follow the <Link href="/docs/setup">setup guide</Link>. Questions? Check the{' '}
  <Link href="https://status.example.com" external>status page</Link> or read the{' '}
  <Link href="/terms" tone="muted">terms</Link>.
</p>
```

## With a router

Pass your router's link as `render` to keep client-side navigation and the styles.

```tsx
import NextLink from 'next/link';

<Link render={<NextLink href="/docs/components/button" />}>Button docs</Link>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | – | Destination |
| `tone` | `'default' \| 'muted'` | `'default'` | Ink or muted text |
| `external` | `boolean` | `false` | Opens in a new tab with rel="noopener noreferrer", an icon and screen-reader text |
| `externalLabel` | `string` | `'(opens in new tab)'` | Screen-reader text for external links. Pass Vietnamese, e.g. "(mở trong thẻ mới)" |
| `render` | `ReactElement` | – | Render as another element, e.g. a Next.js Link |

## Accessibility

- Tab focuses the link and Enter follows it; the focus ring is the standard 2px ring.
- Link text should make sense on its own ("setup guide", not "click here"); screen-reader users often list links out of context.
- External links say "(opens in new tab)" to screen readers; the arrow icon is decorative.
- Links are underlined in every tone, so they are told apart from text without color.

## Exact types

```ts
export type LinkProps = useRender.ComponentProps<'a'> & {
  /** `default` ink, `muted` for secondary links (footers, meta lines). */
  tone?: 'default' | 'muted';
  /** Opens in a new tab: adds `target="_blank"`, `rel="noopener noreferrer"`, an icon and screen-reader text. */
  external?: boolean;
  /** Screen-reader text for external links. Pass a Vietnamese string in Vietnamese UIs. */
  externalLabel?: string;
};
```
