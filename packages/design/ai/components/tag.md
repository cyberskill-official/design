# Tag

> Compact label for categories, versions or plans. Optionally removable.

```tsx
import { Tag } from '@cyberskill/design';
```

Use a tag to label something with a category, version or plan: "SOC 2", "v2.4.1", "Enterprise". Add `onRemove` when the user can take it off, e.g. filters or selected values. For a status (Active, Failed) use a [Badge](/docs/components/badge).

## Static

```tsx
<Tag>SOC 2</Tag>
<Tag>v2.4.1</Tag>
<Tag>Enterprise</Tag>
```

## Removable

The remove button is named after the tag ("Remove SOC 2"). Pass `removeLabel` in other languages.

```tsx
const [tags, setTags] = useState(['SOC 2', 'ISO 27001', 'v2.4.1', 'Enterprise']);

{tags.map((t) => (
  <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>
))}

<Tag onRemove={remove} removeLabel="Xóa">Doanh nghiệp</Tag>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onRemove` | `(event) => void` | – | Shows a remove (×) button and is called when it is pressed |
| `removeLabel` | `string` | `'Remove'` | First word of the remove button name; the tag text follows |

Other props go to the outer `<span>`.

## Accessibility

- Tab reaches each remove button; Enter or Space removes the tag.
- Screen readers hear "Remove SOC 2, button", so several remove buttons are never ambiguous.
- After a tag is removed its button is gone: move focus to the next tag, the previous one, or the input that adds tags.
- The remove button keeps a 44px touch area, leaning right so a tap on the text never removes the tag.

## Exact types

```ts
export type TagProps = ComponentProps<'span'> & {
  /** Shows a remove (×) button. Move focus somewhere sensible after removing, e.g. the next tag or the input. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** First word of the remove button's accessible name; the tag text follows ("Remove SOC 2"). Pass "Xóa" in Vietnamese UIs. */
  removeLabel?: string;
};
```
