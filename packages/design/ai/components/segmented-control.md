# Segmented control

> Switch between a few views or modes of the same content.

```tsx
import { SegmentedControl } from '@cyberskill/design';
```

Use a segmented control to switch between 2 to 5 views or modes of the same content: list or board, 7 or 30 days. One segment is always selected. It changes what is shown, not data; for a choice that is saved with a form, use a radio group. For switching between separate panels of content, use tabs.

## Basic

```tsx
const [view, setView] = useState('board');
<SegmentedControl
  label="View"
  items={[
    { value: 'list', label: 'List' },
    { value: 'board', label: 'Board' },
    { value: 'timeline', label: 'Timeline' },
  ]}
  value={view}
  onValueChange={setView}
/>
```

## Sizes and icons

`sm` is 32px, `md` 40px and `lg` 48px tall. Put an icon before the text inside `label`; keep the text.

```tsx
<SegmentedControl label="Date range" size="sm" items={ranges} defaultValue="30d" />
<SegmentedControl label="View" items={views} />
<SegmentedControl
  label="Display"
  size="lg"
  items={[
    { value: 'list', label: <><ListBullets aria-hidden="true" />List</> },
    { value: 'board', label: <><Kanban aria-hidden="true" />Board</> },
    { value: 'chart', label: <><ChartBar aria-hidden="true" />Chart</>, disabled: true },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | – | Accessible name of the group (required), e.g. "View" / "Chế độ xem" |
| `items` | `{ value, label, disabled? }[]` | – | Segments in display order (required) |
| `value / defaultValue` | `string` | `first item` | Controlled or initial selected segment |
| `onValueChange` | `(value) => void` | – | Called with the newly selected value |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |
| `disabled` | `boolean` | `false` | Disables every segment |

## Accessibility

- The control is a group named by `label`; each segment is a toggle button with `aria-pressed`.
- Tab focuses the selected segment; arrow keys move between segments, Enter or Space selects.
- Pressing the selected segment again keeps it selected, so there is never an empty state.
- Each segment has a 44px touch area. The selected segment differs by surface, shadow and text weight, not only color.

## Exact types

```ts
export type SegmentedControlProps<Value extends string = string> = Omit<ToggleGroup.Props<Value>, 'className' | 'value' | 'defaultValue' | 'onValueChange' | 'multiple' | 'children'> & {
  className?: string;
  /** Segments in display order (2 to 5 short labels work best). */
  items: SegmentedControlItem<Value>[];
  /** Selected segment (controlled). */
  value?: Value;
  /** Initially selected segment (uncontrolled). Defaults to the first item. */
  defaultValue?: Value;
  /** Called with the newly selected value. One segment always stays selected. */
  onValueChange?: (value: Value) => void;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name of the group, e.g. "View" / "Chế độ xem". Required: the control has no visible label. */
  label: string;
};
```
