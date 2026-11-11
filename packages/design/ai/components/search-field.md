# Search field

> A labelled search input with a search icon, a clear button, Escape to clear, and optional loading and shortcut hints.

```tsx
import { SearchField } from '@cyberskill/design';
```

Use a search field to filter a list or table in place, or as the search box in a header. It is a text input of `type="search"` built on the text field, so it lines up with other form fields. When people should pick from suggestions as they type, use an [autocomplete](/docs/components/autocomplete); for a ⌘K palette of commands, use a [command menu](/docs/components/command-menu).

## Filter a list

The value is the typed text. The clear (×) button appears once there is text, empties the field and keeps focus in it; Escape does the same.

```tsx
const [query, setQuery] = useState('');

<SearchField label="Search agents" placeholder="Name or ID" value={query} onValueChange={setQuery} />
```

## Loading

`loading` shows a small spinner while results load. It is announced as a polite status.

```tsx
<SearchField label="Search documents" value={query} onValueChange={setQuery} loading={isFetching} description="Results update as you type." />
```

## Shortcut hint

`shortcut` shows a key hint while the field is empty. It is display only: focus the field from your own key handler. In a header, hide the label visually with `hideLabel`; it still names the field.

```tsx
<SearchField label="Search" hideLabel placeholder="Search…" shortcut="⌘K" />
<SearchField label="Search" hideLabel placeholder="Search…" shortcut="/" size="sm" />
```

## Vietnamese labels

```tsx
<SearchField label="Tìm kiếm" placeholder="Tên hoặc mã" defaultValue="hà nội" clearLabel="Xoá tìm kiếm" loadingLabel="Đang tải" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label and accessible name (required) |
| `hideLabel` | `boolean` | `false` | Hides the label visually; it still names the field |
| `value / defaultValue` | `string` | `– / ''` | Controlled or initial text |
| `onValueChange` | `(value: string) => void` | – | Called on typing, the clear button and Escape |
| `clearLabel` | `string` | `'Clear search'` | Accessible name of the clear button |
| `loading` | `boolean` | `false` | Shows a spinner while results load |
| `loadingLabel` | `string` | `'Loading'` | Announced while loading |
| `shortcut` | `string` | – | Key hint shown while empty, e.g. "⌘K". Display only |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48px |
| `description / error` | `ReactNode` | – | Help text, and an error that marks the field invalid |
| `fieldClassName / className` | `string` | – | Classes for the field wrapper / the input |

Other input props (`placeholder`, `name`, `disabled`, `autoFocus`, `ref`, `onKeyDown`…) pass through to the input.

## Accessibility

- The input is a `searchbox` named by its label; help and error text are its description. The search icon is decorative.
- Escape clears the text. With nothing to clear, Escape passes on, so it still closes a surrounding dialog.
- The clear button is a real button named by `clearLabel`, reachable with Tab, and returns focus to the input. The browser's own clear button is hidden so there is only one.
- The loading spinner is a polite `status`; the shortcut hint is hidden from screen readers. To announce the shortcut, pass `aria-keyshortcuts` (e.g. `"Meta+K"`).

## Exact types

```ts
export type SearchFieldProps = Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onValueChange' | 'startAdornment' | 'endAdornment'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error'> & {
  /** The search text, controlled. */
  value?: string;
  /** The initial search text, uncontrolled. */
  defaultValue?: string;
  /** Called with the new text on typing, the clear button and Escape. */
  onValueChange?: (value: string) => void;
  /** Accessible name of the clear (×) button, e.g. "Xoá tìm kiếm". */
  clearLabel?: string;
  /** Shows a spinner while results load. */
  loading?: boolean;
  /** Announced while `loading`, e.g. "Đang tải". */
  loadingLabel?: string;
  /** Key hint shown while the field is empty, e.g. "⌘K" or "/". Display only: wire the shortcut yourself. */
  shortcut?: string;
  /** Class for the field wrapper; `className` goes to the input. */
  fieldClassName?: string;
};
```
