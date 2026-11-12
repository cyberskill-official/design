# Empty state

> Fills an empty list, table or page and points to the next step.

```tsx
import { Button, EmptyState } from '@cyberskill/design';
```

Use an empty state when there is nothing to show yet (no projects), nothing matches (no search results) or everything is done (inbox zero). Say what is empty, why, and offer one clear next step. Do not use it for errors: use an [alert](/docs/components/alert).

## First use

```tsx
<EmptyState
  icon={<FolderOpen />}
  title="No projects yet"
  description="Projects hold your agents, their training sources and conversations. Create one to get started."
  action={<Button iconStart={<Plus />}>New project</Button>}
/>
```

## Inside a card

Use `size="sm"` in cards, panels and tables.

```tsx
<EmptyState
  size="sm"
  icon={<MagnifyingGlass />}
  title="No results for “invoice”"
  description="Check the spelling or try a broader search."
  action={<Button variant="secondary" size="sm">Clear search</Button>}
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | – | What is empty (required) |
| `description` | `ReactNode` | – | Why, and what to do next |
| `icon` | `ReactNode` | – | Phosphor icon in a tile (decorative) |
| `action` | `ReactNode` | – | Next step, usually one Button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | sm in cards and tables, lg for a whole page |
| `headingLevel` | `1 – 6` | `3` | Heading level of the title so it fits the page outline |

## Accessibility

- The title is a real heading; set `headingLevel` so it follows the headings around it.
- The icon is decorative and hidden from screen readers.
- Text meets 4.5:1 in light and dark.

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
export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  className?: string;
  /** Phosphor icon shown in a tile above the title (decorative). */
  icon?: ReactNode;
  /** What is empty, e.g. "No projects yet". */
  title: ReactNode;
  /** Why, and what to do next. */
  description?: ReactNode;
  /** Next step, usually one Button (add a secondary one if needed). */
  action?: ReactNode;
  /** `sm` inside cards and tables, `md` in a section, `lg` for a whole page. */
  size?: 'sm' | 'md' | 'lg';
  /** Heading level of the title so it fits the page outline. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};
```
