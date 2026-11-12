# Card

> A surface that groups related content, with optional header, footer, a link style, soft tones and brand surfaces.

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

When the whole card goes somewhere, render it as the link and add `interactive` for the hover and focus styles: the border darkens and, with a mouse, the card lifts 2px. Use a Next.js `Link` the same way. Keep buttons out of a link card.

```tsx
<Card interactive render={<a href="/settings/billing" />}>
  <CardHeader>
    <CardTitle>Billing</CardTitle>
    <CardDescription>Plans, invoices and payment methods.</CardDescription>
  </CardHeader>
</Card>

<Card interactive render={<NextLink href="/settings/security" />}>…</Card>
```

## Tones

`tone` tints the card softly to say what it holds: `accent` for an AI suggestion, `warning` for a notice, a category tone for a team. Use it for one or two cards on a page, not a whole grid.

```tsx
<Card tone="accent">
  <CardHeader>
    <CardTitle>Suggested reply</CardTitle>
    <CardDescription>Drafted from the last three messages.</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button variant="soft" tone="accent" size="sm" iconStart={<Sparkle />}>Use draft</Button>
  </CardFooter>
</Card>
<Card tone="warning">…</Card>
```

## Surfaces

`surface` is for one brand moment per view, such as the plan card on a billing page. `ink` paints the ink gradient and renders the card's content in the dark theme, so text, buttons and badges inside take their dark colors on their own. `aurora` is a soft wash of blue, teal and gold in the page's theme. A surface overrides `tone`.

```tsx
<Card surface="ink">
  <CardHeader>
    <CardTitle>Pro plan</CardTitle>
    <CardDescription>84% of this month's seats are in use.</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button size="sm">Upgrade</Button>
    <Button variant="ghost" size="sm">Compare plans</Button>
  </CardFooter>
</Card>
<Card surface="aurora">…</Card>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `interactive` | `boolean` | `false` | Hover border, a 2px lift with a mouse and a focus ring, for a card that is itself a link |
| `tone` | `'primary' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'blue' \| 'amber' \| 'teal' \| 'magenta' \| 'violet'` | – | Soft tinted card |
| `surface` | `'ink' \| 'aurora'` | – | Brand surface; ink also renders the content in the dark theme. Overrides tone |
| `render` | `ReactElement` | – | Render as another element, e.g. <a href> or a Next.js Link |

`CardTitle` also takes `render` to change its heading level. Other parts are plain elements and take their native props.

## Accessibility

- A link card is one link: Tab focuses it, Enter follows it, and its accessible name is the card's text. Keep that text short; the title should lead.
- On an ink card the focus ring and the hover edge are drawn just inside the card, on the ink, so they show on light and dark pages alike.
- Choose the `CardTitle` heading level from the page outline, not from the size you want.
- Hover and focus show a border change, not only a shadow, so they read in both themes. The hover lift is off with reduced motion and on touch screens.
- Text keeps 4.5:1 on every tone and surface: the ink card uses the dark theme's colors, checked like any dark page.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type BadgeProps = ComponentProps<'span'> & {
  /**
   * Color meaning. `success`, `warning`, `danger` and `info` show a status icon by default.
   * Category tones (`blue`, `amber`, `teal`, `magenta`, `violet`) label a kind, not a status; they stay tinted even as `solid`.
   */
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
export type CardProps = useRender.ComponentProps<'div'> & {
  /** Hover and focus styles for a card that is itself a link. Pair with `render={<a href="…" />}` (or a Next.js `Link`). */
  interactive?: boolean;
  /** A soft tinted card in this tone, e.g. `accent` for an AI suggestion or `warning` for a notice. */
  tone?: Tone;
  /**
   * A brand surface for one moment per view. `ink` paints the ink gradient and renders its content in the dark theme;
   * `aurora` paints a soft multi-color wash. Overrides `tone`.
   */
  surface?: 'ink' | 'aurora';
};
export type CardContentProps = ComponentProps<'div'>;
export type CardDescriptionProps = ComponentProps<'p'>;
export type CardFooterProps = ComponentProps<'div'>;
export type CardHeaderProps = ComponentProps<'div'>;
export type CardTitleProps = useRender.ComponentProps<'h3'>;
```
