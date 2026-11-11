# Autocomplete

> A search input with a suggestion list. Free text is allowed; suggestions fill it in.

```tsx
import { Autocomplete, Field } from '@cyberskill/design';
```

Use an autocomplete for search boxes and free-text inputs that benefit from suggestions: site search, a city, a tag that may be new. The value is the **typed text**, not a chosen item. When the answer must be one of the options, use a combobox instead.

## Search

```tsx
const cities = ['Hà Nội', 'Hải Phòng', 'Huế', 'Đà Nẵng', 'Hồ Chí Minh'];
const [query, setQuery] = useState('');

<Autocomplete aria-label="Search cities" items={cities} placeholder="Search cities" value={query} onValueChange={setQuery} />
```

Matching ignores case and accents, so "ha noi" finds "Hà Nội", and the matched part is bold.

## Groups

```tsx
const workspace = [
  { label: 'Pages', items: [{ value: 'billing', label: 'Billing', description: 'Settings › Billing' }] },
  { label: 'People', items: ['Linh Nguyen', 'Minh Tran', 'An Pham'] },
];

<Autocomplete aria-label="Search workspace" items={workspace} placeholder="Search pages and people" />
```

## In a form field

Wrap it in `Field` for a visible label and help text. `icon={null}` drops the search glass; `emptyText={null}` hides the "No results" message when free text is expected.

```tsx
<Field label="City" description="Free text is fine if your city is not listed.">
  <Autocomplete items={cities} icon={null} placeholder="e.g. Đà Lạt" emptyText={null} />
</Field>
<Autocomplete aria-label="Search" items={cities} size="sm" highlightMatches={false} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `(string \| { value, label, description? })[] \| { label, items }[]` | – | Suggestions, flat or grouped (required) |
| `value / defaultValue` | `string` | – | The input text, controlled or initial |
| `onValueChange` | `(value: string, details) => void` | – | Called as the user types or picks a suggestion |
| `icon` | `ReactNode` | `MagnifyingGlass` | Leading icon; null for none |
| `highlightMatches` | `boolean` | `true` | Bold the matched part of each suggestion |
| `emptyText` | `ReactNode` | `'No results'` | Shown when nothing matches; null for none |
| `clearLabel` | `string` | `'Clear'` | Accessible name of the × button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |
| `placeholder / aria-label` | `string` | – | Hint text, and the name when there is no visible label |

`className` styles the input box; `ref` and `onBlur` go to the input. Base UI root props (`mode`, `autoHighlight`, `limit`, `filter`, `openOnInputClick`, `submitOnItemClick`…) pass through.

## Accessibility

- The input has the `combobox` role. Give it a visible label with `Field`, or an `aria-label`.
- Arrow Up/Down move through suggestions, Enter fills the input with the highlighted one, Escape closes the list and keeps the typed text.
- Group headings name their groups, so screen readers announce "People" when entering that section.
- The "No results" message is announced politely as the list empties.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type AutocompleteProps = Omit<BaseUI.Autocomplete.Root.Props<AutocompleteItem>, 'items' | 'children'> & {
  /** Suggestions, flat or in groups (`{ label, items }`). Typing filters them. */
  items: AutocompleteItem[] | AutocompleteGroup[];
  placeholder?: string;
  size?: AutocompleteSize;
  /** Leading icon. Defaults to a search glass; pass `null` for none. */
  icon?: ReactNode;
  /** Bold the part of each suggestion that matches the typed text. */
  highlightMatches?: boolean;
  /** Shown when nothing matches. Pass `null` to show no message. */
  emptyText?: ReactNode;
  /** Accessible name of the clear (×) button. */
  clearLabel?: string;
  /** Class for the input box. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Accessible name when there is no visible label. Or wrap it in `Field`. */
  'aria-label'?: string;
};
export type FieldProps = Omit<BaseUI.Field.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Visible label. Required for accessibility; hide it visually with `hideLabel` if the design must. */
  label: ReactNode;
  hideLabel?: boolean;
  /** Help text under the control. */
  description?: ReactNode;
  /** Error message. Passing it marks the field invalid and shows the message (for form libraries). */
  error?: ReactNode;
  /** Adds a visual marker and `required` semantics are left to the control. */
  required?: boolean;
  /** Text after the label for optional fields, e.g. "Optional" / "Không bắt buộc". */
  optionalLabel?: ReactNode;
  children: ReactNode;
};
```
