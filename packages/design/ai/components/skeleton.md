# Skeleton

> Placeholder shapes that hold the layout while content loads, with a subtle shimmer.

```tsx
import { Skeleton, SkeletonText } from '@cyberskill/design';
```

Use skeletons when the layout of the coming content is known (cards, lists, tables) and loading takes more than a moment. Match the real shapes so nothing jumps when data arrives. For an action in progress use a button's `loading`; for an unknown layout use a [spinner](/docs/components/spinner).

## Loading pattern

Skeletons are hidden from screen readers. Give the container `aria-busy="true"` and one visually hidden status that names the wait.

```tsx
<div aria-busy="true">
  <span role="status" className="cs-visually-hidden">Loading project</span>
  <Skeleton width={40} height={40} radius="full" />
  <SkeletonText lines={3} />
  <Skeleton height={120} radius="lg" />
</div>
```

## Shapes

```tsx
<Skeleton width={40} height={40} radius="full" />
<Skeleton width={96} height={32} />
<Skeleton width={160} height={16} radius="sm" />
<SkeletonText lines={2} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `100%` | Numbers are px |
| `height` | `number \| string` | `16px` | Numbers are px |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Corner radius token; full for avatars and pills |
| `lines` | `number` | `3` | SkeletonText only: number of lines; the last is shorter |

## Accessibility

- Every skeleton is `aria-hidden`; the container's status message is what screen readers hear, once.
- Remove `aria-busy` and the status when content arrives.
- The shimmer stops under reduced motion and the blocks stay still.

## Exact types

```ts
export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  /** CSS width; numbers are px. Default fills the container. */
  width?: CSSProperties['width'];
  /** CSS height; numbers are px. Default 16px. */
  height?: CSSProperties['height'];
  /** Corner radius token. Use `full` for avatars and pills. */
  radius?: 'sm' | 'md' | 'lg' | 'full';
};
export type SkeletonTextProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  /** Number of lines; the last one is shorter, like a paragraph. */
  lines?: number;
};
```
