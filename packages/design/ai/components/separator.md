# Separator

> A thin line between groups of content, horizontal or vertical, with an optional label.

```tsx
import { Button, Separator } from '@cyberskill/design';
```

Use a separator to divide groups that are otherwise hard to tell apart. Prefer spacing first; a line on every row adds noise.

## Horizontal

```tsx
<Separator />
```

## With a label

```tsx
<Button variant="secondary" fullWidth>Continue with Google</Button>
<Separator label="or" />
<Button fullWidth>Continue with email</Button>
```

## Vertical

Inside a flex row the line stretches to the row's height.

```tsx
<span>Docs</span>
<Separator orientation="vertical" />
<span>API reference</span>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the line |
| `label` | `ReactNode` | – | Text in the middle, e.g. "or" / "hoặc". A string label also names the separator |

## Accessibility

- Renders `role="separator"` with `aria-orientation`, so screen readers announce the break.
- A string `label` becomes its accessible name ("or, separator").
- The line uses the border token, which flips with the theme.

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
export type SeparatorProps = Omit<BaseUI.Separator.Props, 'className' | 'children'> & {
  className?: string;
  /** Text in the middle of the line, e.g. "or" / "hoặc". A string label also becomes the separator's accessible name. */
  label?: ReactNode;
};
```
