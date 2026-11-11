# Toggle

> A button that stays on or off, such as Bold or Favorite. Text with an icon, or icon-only.

```tsx
import { Toggle } from '@cyberskill/design';
```

Use a toggle for an on/off state that applies right away and reads well as a pressed button: Bold, Favorite, Pin, Mute. For a setting with an on/off label, use a switch. To pick one of several views, use a segmented control.

## With text

```tsx
const [favorite, setFavorite] = useState(false);

<Toggle icon={<Star />} pressedIcon={<Star weight="fill" />} pressed={favorite} onPressedChange={setFavorite}>
  {favorite ? 'Favorited' : 'Favorite'}
</Toggle>
<Toggle icon={<Star />} defaultPressed>Pinned</Toggle>
<Toggle disabled>Locked</Toggle>
```

## Icon-only

Without children the toggle is square and `label` becomes its accessible name.

```tsx
<Toggle icon={<TextB />} label="Bold" defaultPressed />
<Toggle icon={<TextItalic />} label="Italic" />
<Toggle icon={<TextUnderline />} label="Underline" />
```

## Sizes

```tsx
<Toggle size="sm" icon={<Star />}>Small</Toggle>
<Toggle icon={<Star />}>Medium</Toggle>
<Toggle size="lg" icon={<Star />}>Large</Toggle>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `pressed / defaultPressed` | `boolean` | `false` | On state, controlled or initial |
| `onPressedChange` | `(pressed, details) => void` | – | Called when it is toggled |
| `icon` | `ReactNode` | – | Decorative icon before the text |
| `pressedIcon` | `ReactNode` | – | Shown instead of icon while pressed, e.g. a filled star |
| `label` | `string` | – | Accessible name of an icon-only toggle (required then) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |
| `disabled` | `boolean` | `false` | Ignores clicks and is skipped by Tab |

All native button props and Base UI's `value` (for toggle groups) pass through.

## Accessibility

- It is a button with `aria-pressed`, so screen readers say "Bold, toggle button, pressed".
- Space and Enter flip it. The pressed state shows a tinted fill and border, not only a color change of the icon.
- Small and medium toggles keep a 44px touch area.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type ToggleProps = Omit<BaseUI.Toggle.Props, 'className'> & {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Icon before the text (decorative). */
  icon?: ReactNode;
  /** Icon shown instead of `icon` while pressed, e.g. a filled star. */
  pressedIcon?: ReactNode;
  /** Accessible name for an icon-only toggle (no children). Required then. */
  label?: string;
};
```
