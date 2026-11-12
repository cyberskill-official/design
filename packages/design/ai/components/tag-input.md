# Tag input

> Free-text values typed or pasted as removable chips, for email lists and keywords.

```tsx
import { TagInput, TagRejectReason } from '@cyberskill/design';
```

Use a tag input when people type **their own** values: email addresses to invite, keywords, labels. Enter or a comma turns the text into a chip, a paste with commas or new lines adds several at once, and Backspace in the empty input removes the last chip. When the values come from a known list, use a multi-select instead.

## Basic

```tsx
<TagInput label="Keywords" placeholder="Type and press Enter" defaultValue={['design', 'tokens']} description="Enter or a comma adds a keyword." />
```

## Validation and rejections

`validate` refuses values (here, anything that is not an email address), duplicates are refused ignoring case, and `max` caps the list. A refused value stays in the input so it can be fixed, and `onReject(tag, reason)` tells you why, so you can show it as the field's `error`.

```tsx
const [emails, setEmails] = useState<string[]>(['an@acme.vn']);
const [error, setError] = useState<string>();
const messages: Record<TagRejectReason, (tag: string) => string> = {
  duplicate: (tag) => `${tag} is already on the list.`,
  invalid: (tag) => `${tag} is not an email address.`,
  max: () => 'Invite up to 5 people at a time.',
};

<TagInput
  label="Invite by email"
  value={emails}
  onValueChange={(next) => { setEmails(next); setError(undefined); }}
  validate={(tag) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag)}
  max={5}
  onReject={(tag, reason) => setError(messages[reason](tag))}
  error={error}
  inputMode="email"
/>
```

## States

```tsx
<TagInput label="Reviewers" defaultValue={['an', 'binh', 'chi']} max={3} description="Up to 3 reviewers." />
<TagInput label="Topics" defaultValue={['billing']} error="Add at least two topics." />
<TagInput label="Locked" defaultValue={['Hà Nội', 'Huế']} disabled />
<TagInput label="Từ khoá" size="sm" defaultValue={['Ổn định', 'Đà Nẵng']} removeLabel={(tag) => `Xoá ${tag}`} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required); hideLabel hides it visually |
| `value / defaultValue` | `string[]` | `[]` | The tags, controlled or initial. A controlled value set back to undefined means empty |
| `onValueChange` | `(value: string[]) => void` | – | Called when a tag is added or removed |
| `validate` | `(tag: string) => boolean` | – | Return false to refuse a tag |
| `max` | `number` | – | Most tags the list may hold |
| `onReject` | `(tag, reason: 'duplicate' \| 'invalid' \| 'max') => void` | – | Called for each refused tag; the text stays in the input |
| `removeLabel` | `(tag) => string` | ``Remove ${tag}`` | Accessible name of each chip's × button |
| `name` | `string` | – | Submits each tag with a native form, one hidden input per tag. Half-typed text is not submitted |
| `placeholder` | `string` | – | Shown only while there are no tags |
| `description / error / optionalLabel` | `ReactNode` | – | Help text, error message (marks the field invalid) and "Optional" text |
| `required / disabled` | `boolean` | – | required shows the marker and sets aria-required; disabled locks typing and removing and submits nothing |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Minimum height 32, 40 or 48px; grows as chips wrap |

Other input props (`inputMode`, `aria-*`, `onBlur`, `ref`…) pass through to the text input; `className` goes to the box and `fieldClassName` to the wrapper.

## Accessibility

- The input is a labelled text box; the help text and error are linked to it and errors set `aria-invalid`.
- Enter adds the typed text instead of submitting the form; with nothing typed, Enter submits as usual. While an input method is composing (Vietnamese Telex, for example), Enter only confirms the word.
- Each chip's remove button is named "Remove design" (or your `removeLabel`) and has a 24px target. After a removal, focus goes back to the input.
- Shift+Tab from the input reaches the remove buttons in order.

## Exact types

```ts
export type TagInputProps = Omit<InputProps, 'value' | 'defaultValue' | 'onValueChange' | 'startAdornment' | 'endAdornment' | 'type' | 'name' | 'required'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel' | 'required'> & {
  /** The tags, controlled. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Called for each typed or pasted tag that is not added. The text stays in the input so it can be fixed. */
  onReject?: (tag: string, reason: TagRejectReason) => void;
  /** Most tags the list may hold. */
  max?: number;
  /** Return false to refuse a tag, e.g. one that is not an email address. */
  validate?: (tag: string) => boolean;
  /** Submits each tag with a native form (one hidden input per tag) under this name. */
  name?: string;
  /** Accessible name of each chip's remove button. Pass Vietnamese text in Vietnamese UIs. */
  removeLabel?: (tag: string) => string;
  /** Class for the field wrapper; `className` goes to the box. */
  fieldClassName?: string;
};
```
