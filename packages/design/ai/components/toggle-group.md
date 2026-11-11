# Toggle group

> A row of toggle buttons sharing one state, for picking one option or several, such as text formatting or filter chips.

```tsx
import { ToggleGroup, ToggleGroupItem } from '@cyberskill/design';
```

Use a toggle group for a few related on/off buttons that apply right away: Bold, Italic and Underline; text alignment; status filters above a list. Each item is a [toggle](/docs/components/toggle). To switch between views of the same content, use a [segmented control](/docs/components/segmented-control); for a form value, use a radio group or checkboxes.

## Several at once

`multiple` lets any number of items be pressed. `value` and `defaultValue` are arrays of the pressed items' values.

```tsx
<ToggleGroup label="Text formatting" multiple defaultValue={['bold']}>
  <ToggleGroupItem value="bold" icon={<TextB />} label="Bold" />
  <ToggleGroupItem value="italic" icon={<TextItalic />} label="Italic" />
  <ToggleGroupItem value="underline" icon={<TextUnderline />} label="Underline" />
</ToggleGroup>
```

## One at a time

Without `multiple`, pressing an item releases the others. The value is still an array, with one entry or none; ignore the empty array to keep one item always pressed.

```tsx
const [align, setAlign] = useState(['left']);

<ToggleGroup label="Text alignment" value={align} onValueChange={(v) => v.length && setAlign(v)}>
  <ToggleGroupItem value="left" icon={<TextAlignLeft />} label="Align left" />
  <ToggleGroupItem value="center" icon={<TextAlignCenter />} label="Align center" />
  <ToggleGroupItem value="right" icon={<TextAlignRight />} label="Align right" />
</ToggleGroup>
```

## Filter chips

Items with text work as filter chips. The row wraps on narrow screens.

```tsx
const [status, setStatus] = useState(['active', 'paused']);

<ToggleGroup label="Status" multiple size="sm" value={status} onValueChange={setStatus}>
  <ToggleGroupItem value="active">Active</ToggleGroupItem>
  <ToggleGroupItem value="paused">Paused</ToggleGroupItem>
  <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
  <ToggleGroupItem value="archived" disabled>Archived</ToggleGroupItem>
</ToggleGroup>
```

## Vietnamese labels

```tsx
<ToggleGroup label="Định dạng chữ" multiple>
  <ToggleGroupItem value="bold" icon={<TextB />} label="In đậm" />
  <ToggleGroupItem value="italic" icon={<TextItalic />} label="In nghiêng" />
  <ToggleGroupItem value="underline" icon={<TextUnderline />} label="Gạch chân" />
</ToggleGroup>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | – | Accessible name of the group (required) |
| `multiple` | `boolean` | `false` | Let several items be pressed at once |
| `value / defaultValue` | `string[]` | – | Pressed item values, controlled or initial |
| `onValueChange` | `(value: string[], details) => void` | – | Called when an item is pressed or released |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of every item: 32, 40 or 48px |
| `disabled / orientation` | `boolean / 'horizontal' \| 'vertical'` | `false / 'horizontal'` | Disable the whole group; stack it vertically |
| `value (Item)` | `string` | – | Identifies the item in the group value (required) |
| `icon / label (Item)` | `ReactNode / string` | – | Decorative icon; accessible name of an icon-only item (required then) |
| `disabled (Item)` | `boolean` | `false` | Disable one item |

## Accessibility

- The group is a `group` named by `label`; each item is a button with `aria-pressed`, so screen readers say "Bold, toggle button, pressed".
- The group is one Tab stop. Arrow keys move between items (wrapping at the ends), Space and Enter press or release the focused one.
- The pressed state shows a tinted fill and border, not only a color change of the icon.
- Small and medium items keep a 44px touch area, and the gap between items keeps neighbouring areas from overlapping.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ToggleGroupProps = Omit<BaseUI.ToggleGroup.Props, 'className'> & {
  className?: string;
  /** Accessible name of the group, e.g. "Text formatting" / "Định dạng chữ". */
  label: string;
  /** Size of every item: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: ToggleGroupSize;
};
export type ToggleGroupItemProps = Omit<ToggleProps, 'size' | 'value'> & {
  /** Identifies the item in the group's `value`. */
  value: string;
};
```
