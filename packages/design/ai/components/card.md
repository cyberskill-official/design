# Card

> A surface that groups related content, with optional header, footer and a link style.

```tsx
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@cyberskill/design';
```

Use a card to group one topic's content: a summary, a setting, a resource in a grid. Do not nest cards, and do not wrap a whole page section in one; a plain heading and spacing is calmer. For a single KPI use [Stat](/docs/components/stat).

## Anatomy

`Card` holds `CardHeader` (with `CardTitle` and `CardDescription`), `CardContent` and `CardFooter`. All parts are optional. `CardTitle` is an `h3`; pick the level that fits the page with `render={<h2 />}`.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Usage this month</CardTitle>
    <CardDescription>12,480 of 20,000 API requests. Resets on the 1st.</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge tone="success">Healthy</Badge>
  </CardContent>
  <CardFooter>
    <Button variant="secondary" size="sm">View details</Button>
    <Button size="sm">Upgrade plan</Button>
  </CardFooter>
</Card>
```

## Card as a link

When the whole card goes somewhere, render it as the link and add `interactive` for the hover and focus styles. Use a Next.js `Link` the same way. Keep buttons out of a link card.

```tsx
<Card interactive render={<a href="/settings/billing" />}>
  <CardHeader>
    <CardTitle>Billing</CardTitle>
    <CardDescription>Plans, invoices and payment methods.</CardDescription>
  </CardHeader>
</Card>

<Card interactive render={<NextLink href="/settings/security" />}>…</Card>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `interactive` | `boolean` | `false` | Hover border and focus ring, for a card that is itself a link |
| `render` | `ReactElement` | – | Render as another element, e.g. <a href> or a Next.js Link |

`CardTitle` also takes `render` to change its heading level. Other parts are plain elements and take their native props.

## Accessibility

- A link card is one link: Tab focuses it, Enter follows it, and its accessible name is the card's text. Keep that text short; the title should lead.
- Choose the `CardTitle` heading level from the page outline, not from the size you want.
- Hover and focus show a border change, not only a shadow, so they read in both themes.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type BadgeProps = ComponentProps<'span'> & {
  /** Color meaning. `success`, `warning`, `danger` and `info` show a status icon by default. */
  tone?: BadgeTone;
  /** `soft` tinted (default), `solid` filled, `outline` bordered. */
  variant?: BadgeVariant;
  /** `sm` 20px, `md` 24px tall. */
  size?: 'sm' | 'md';
  /** Decorative icon before the text. Replaces a status tone's icon; `false` removes the icon on non-status tones only. */
  icon?: ReactNode | false;
};
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
export type CardProps = useRender.ComponentProps<'div'> & {
  /** Hover and focus styles for a card that is itself a link. Pair with `render={<a href="…" />}` (or a Next.js `Link`). */
  interactive?: boolean;
};
export type CardContentProps = ComponentProps<'div'>;
export type CardDescriptionProps = ComponentProps<'p'>;
export type CardFooterProps = ComponentProps<'div'>;
export type CardHeaderProps = ComponentProps<'div'>;
export type CardTitleProps = useRender.ComponentProps<'h3'>;
```
