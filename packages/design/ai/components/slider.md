# Slider

> Pick a value or a range by dragging along a track. Labels, value text and tick marks.

```tsx
import { Slider } from '@cyberskill/design';
```

Use a slider when the rough position matters more than the exact number: volume, a price range, response length. When people need to enter an exact number, use a number field (or put one next to the slider).

## Single value

```tsx
<Slider label="Volume" defaultValue={40} />
<Slider label="Locked" defaultValue={30} disabled />
```

## Range

Pass an array for two thumbs and name each one with `thumbLabels`.

```tsx
const [price, setPrice] = useState<number | readonly number[]>([2_000_000, 8_000_000]);

<Slider
  label="Price"
  value={price}
  onValueChange={setPrice}
  min={0}
  max={10_000_000}
  step={500_000}
  locale="vi-VN"
  format={{ style: 'currency', currency: 'VND' }}
  thumbLabels={['Giá thấp nhất', 'Giá cao nhất']}
/>
```

## Marks

```tsx
<Slider
  label="Response length"
  defaultValue={50}
  step={25}
  showValue={false}
  marks={[{ value: 0, label: 'Short' }, 25, { value: 50, label: 'Medium' }, 75, { value: 100, label: 'Long' }]}
/>
<Slider thumbLabels={['Zoom']} defaultValue={30} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label; names the thumb of a single slider |
| `value / defaultValue` | `number \| number[]` | – | One number, or an array for a range |
| `onValueChange` | `(value, details) => void` | – | Called while dragging; onValueCommitted fires on release |
| `min / max / step` | `number` | `0 / 100 / 1` | Range and granularity |
| `thumbLabels` | `string[]` | – | Accessible name per thumb. Required for a range and for a slider without label |
| `showValue` | `boolean` | `true with label` | Show the formatted value(s) beside the label |
| `marks` | `(number \| { value, label? })[]` | – | Tick marks; those with a label get text under the track |
| `format / locale` | `Intl.NumberFormatOptions / string` | `– / 'en-US'` | How values are shown and announced; the locale is fixed by default so server and browser HTML match |
| `disabled / name` | `boolean / string` | – | Form semantics |

Other Base UI root props (`largeStep`, `minStepsBetweenValues`, `thumbCollisionBehavior`, `onValueCommitted`…) pass through.

## Accessibility

- Each thumb is a `slider` with its value, minimum and maximum; formatted values (such as currency) are announced as written.
- Arrow keys step the value, Page Up/Down and Shift+Arrow take large steps, Home and End jump to the ends.
- Thumbs are 20px with a 44px touch area and a visible focus ring.
- Mark labels are visual only; the value itself is always announced.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type SliderProps = Omit<BaseUI.Slider.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Visible label above the track; names the thumb of a single slider. */
  label?: ReactNode;
  /** Show the formatted value(s) next to the label. */
  showValue?: boolean;
  /**
   * Accessible name of each thumb, in order. Required for a range (two thumbs), e.g. `['Minimum price', 'Maximum price']`,
   * and for a single slider without `label`.
   */
  thumbLabels?: string[];
  /** Tick marks along the track; marks with a `label` also get text under it. */
  marks?: SliderMark[];
  /** Locale of the shown value. Fixed to `en-US` by default (not the runtime locale), so server and client render the same text. */
  locale?: BaseUI.Slider.Root.Props['locale'];
};
```
