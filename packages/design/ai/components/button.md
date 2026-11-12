# Button

> Triggers an action. Seven variants, three sizes, loading and icon-only forms.

```tsx
import { Button, ButtonGroup, IconButton } from '@cyberskill/design';
```

Use a button for actions: save, deploy, delete, open a dialog. Use a link when the click only navigates. Keep **one primary button** per view and at most **one gold `accent` button** for the key moment (often AI).

## Variants

```tsx
<Button>Start free trial</Button>
<Button variant="secondary">Talk to sales</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="quiet">Preview</Button>
<Button variant="accent" iconStart={<Sparkle />}>Ask AI</Button>
<Button variant="danger">Delete project</Button>
<Button variant="link">View docs</Button>
```

## Sizes

`sm` is 32px, `md` 40px and `lg` 48px tall. Small and medium buttons keep an invisible 44px touch area.

```tsx
<Button size="sm" iconStart={<Plus />}>New project</Button>
<Button size="md">Deploy</Button>
<Button size="lg" iconEnd={<ArrowRight />}>Book a demo</Button>
```

## Loading, disabled and icon-only

```tsx
<Button loading={saving}>Saving</Button>
<Button disabled>Disabled</Button>
<IconButton label="Edit" icon={<PencilSimple />} />
```

## Button group

```tsx
<ButtonGroup label="View">
  <Button variant="secondary" size="sm" aria-pressed={view === 'List'}>List</Button>
  <Button variant="secondary" size="sm" aria-pressed={view === 'Board'}>Board</Button>
</ButtonGroup>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'quiet' \| 'accent' \| 'danger' \| 'link'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |
| `loading` | `boolean` | `false` | Shows a spinner, stays focusable, sets aria-busy and ignores clicks |
| `iconStart / iconEnd` | `ReactNode` | – | Decorative icons before or after the label |
| `fullWidth` | `boolean` | `false` | Stretches to the container |
| `render` | `ReactElement` | – | Render as another element, e.g. a Next.js Link |

`IconButton` takes `label` (required, its accessible name) and `icon`. `ButtonGroup` takes `label` when the group has no visible heading.

## Accessibility

- Enter and Space activate. Disabled buttons are skipped by Tab, except `loading`, which stays focusable so focus never jumps.
- Icon-only buttons are named by `label`; screen readers never hear "button" alone.
- Every variant meets 4.5:1 text contrast in light and dark.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
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
export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  label?: string;
};
export type IconButtonProps = Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd' | 'fullWidth'> & {
  /** Accessible name, read by screen readers and shown as the tooltip-free label. Required. */
  label: string;
  icon: ReactNode;
};
```
