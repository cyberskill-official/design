# Reveal

> Fades a page's main content in and lifts it 8px on first load, once. Stagger reveals a short list one item after another. Plain CSS.

```tsx
import { Card, CardDescription, CardHeader, CardTitle, Reveal, Stagger } from '@cyberskill/design';
```

Use a reveal for the first load of a page or a panel: the main content arrives instead of popping in. Use it once, on the few blocks that matter, at most six; never on scroll, on every card, or when data refreshes. For an element moving between places, an exit animation or a count-up, see [Motion](/docs/components/motion).

It is plain CSS (the `reveal` recipe), so it works in Server Components and without JavaScript, and a server-rendered page never restarts it on hydration. Because it is a CSS animation, it plays again whenever its container goes from hidden to shown, such as a tab panel that stays mounted. Put it on content that mounts once.

```tsx
import { Reveal, Stagger } from '@cyberskill/design';
```

## Reveal

A `div` by default; `render` swaps in another element and keeps that element's own props. `delay` adds a wait in milliseconds.

```tsx
<Reveal>
  <Card>
    <CardHeader>
      <CardTitle>Team plan</CardTitle>
      <CardDescription>Shared projects, reviews and progress reports for up to 50 learners.</CardDescription>
    </CardHeader>
  </Card>
</Reveal>
```

## Stagger

Reveals its `Reveal` children one after another, 40ms apart. From the seventh item on they appear with the sixth, so a long list never keeps the reader waiting. For a list, render the `Stagger` as a `ul` and each `Reveal` as an `li`.

```tsx
<Stagger render={<ul />}>
  {lessons.map((lesson) => (
    <Reveal key={lesson.id} render={<li />}>
      <Card><CardHeader><CardTitle>{lesson.title}</CardTitle></CardHeader></Card>
    </Reveal>
  ))}
</Stagger>
```

## Props

### Reveal

| Prop | Type | Default | Description |
|---|---|---|---|
| `delay` | `number` | `0` | Extra wait before it starts, in milliseconds. Added to its Stagger step |
| `render` | `ReactElement` | – | Another element instead of the div, e.g. <section /> or <li /> inside a Stagger list. Its own props are kept |
| `…` | `div props` | – | className, style, ref, aria-*, data-* pass through |

### Stagger

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | – | Reveal items; each starts 40ms after the one before, up to the sixth |
| `render` | `ReactElement` | – | Another element instead of the div, e.g. <ul /> |
| `…` | `div props` | – | className, style, ref, aria-*, data-* pass through |

## Accessibility

- **Reduced motion.** The content appears at once: no fade, no rise, no stagger and no `delay`.
- **Nothing is hidden by the markup.** The content is in the page from the first render, so search, screen readers and pages without JavaScript get it. It is only transparent while it plays.
- **Keyboard.** Reveal takes no focus and keeps the reading and focus order of its content.

## Exact types

```ts
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
export type CardDescriptionProps = ComponentProps<'p'>;
export type CardHeaderProps = ComponentProps<'div'>;
export type CardTitleProps = useRender.ComponentProps<'h3'>;
export type RevealProps = ComponentProps<'div'> & {
  /** Extra wait before it starts, in milliseconds. Added to its Stagger step; dropped under reduced motion. */
  delay?: number;
  /** Another element instead of the `div`, e.g. `<li />` inside a Stagger list or `<section />`. */
  render?: RenderElement;
};
export type StaggerProps = ComponentProps<'div'> & {
  /** Another element instead of the `div`, e.g. `<ul />` with `<Reveal render={<li />}>` items. */
  render?: RenderElement;
};
```
