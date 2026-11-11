# Spinner

> A small loading indicator for short waits, announced to screen readers.

```tsx
import { Spinner } from '@cyberskill/design';
```

Use a spinner for a short wait with no known amount: checking a domain, loading a panel. For a task with a known amount use [progress](/docs/components/progress); for content with a known layout use a [skeleton](/docs/components/skeleton); inside a button use its `loading` prop.

## Sizes

`sm` is 16px for inline use, `md` 24px, `lg` 32px for a panel or page. The spinner takes the current text color.

```tsx
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

## With text

When text next to the spinner says the same thing, hide the text so screen readers hear it once.

```tsx
<Spinner size="sm" label="Checking DNS records" />
<span aria-hidden="true">Checking DNS records…</span>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `'Loading'` | Announced to screen readers, e.g. "Đang tải" |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 16, 24 or 32px |

All other `span` props pass through.

## Accessibility

- The spinner is a polite `status` with a visually hidden `label`, so screen readers announce it when it appears.
- Render it only while loading; remove it when done.
- With reduced motion the ring stops turning; the announced label still says what is happening.

## Exact types

```ts
type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  /** Announced to screen readers (polite status). Pass a Vietnamese string in Vietnamese UIs. */
  label?: string;
  /** `sm` 16px (inline), `md` 24px, `lg` 32px (page or panel). */
  size?: 'sm' | 'md' | 'lg';
};
```
