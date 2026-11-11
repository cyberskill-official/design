# Kbd

> Shows a keyboard key or shortcut in running text.

```tsx
import { Kbd } from '@cyberskill/design';
```

Use `Kbd` to show the keys of a shortcut, in help text, menus or tooltips. One `Kbd` per key; adjacent keys space themselves.

## Example

```tsx
<p>Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to search, or <Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd> for commands.</p>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | – | The key, e.g. "⌘", "K", "Esc" |
| `className` | `string` | – | Extra classes |

All native `kbd` attributes pass through.

## Accessibility

- Renders a native `kbd` element, which marks the text as keyboard input.
- Symbols such as ⌘ and ⇧ are read by most screen readers ("command", "shift"); spell out keys where they may not be, or add the word in the sentence.
- A shortcut is never the only way to do something; keep the visible control too.

## Exact types

```ts
type KbdProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
};
```
