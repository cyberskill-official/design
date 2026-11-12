# Avatar

> A person's photo with an initials fallback, and an overlapping group with a "+N" count.

```tsx
import { Avatar, AvatarGroup } from '@cyberskill/design';
```

Use an avatar to show who owns, edited or is assigned to something. It shows initials until the photo loads, and keeps them if the photo fails. Use `AvatarGroup` for a short list of people, such as project members or reviewers.

## Sizes and fallback

`sm` is 24px, `md` 32px and `lg` 40px. Initials come from the first and last word of `name` ("Trần Thị Linh" → "TL"); pass `initials` to override.

```tsx
<Avatar name="Trần Thị Linh" size="sm" />
<Avatar name="Trần Thị Linh" />
<Avatar name="Trần Thị Linh" size="lg" />
<Avatar name="Minh Anh" size="lg" src="/people/minh-anh.jpg" />
<Avatar name="Broken photo" size="lg" src="/missing.png" initials="BP" />
```

## Group

`max` limits how many avatars show; the rest collapse into a "+N" bubble. The group sets one `size` for every avatar, and each avatar gets a ring in the page background color so overlaps stay readable.

```tsx
<AvatarGroup label="Project members" max={4}>
  <Avatar name="An Nguyen" />
  <Avatar name="Binh Tran" src="/people/binh.jpg" />
  <Avatar name="Chi Le" />
  <Avatar name="Dung Pham" />
  <Avatar name="Em Vo" />
  <Avatar name="Giang Ho" />
</AvatarGroup>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | – | Required. Accessible name and source of the initials |
| `src` | `string` | – | Photo URL. Initials show until it loads, and if it fails |
| `initials` | `string` | – | Override the initials taken from name |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24, 32 or 40px |

`AvatarGroup` takes `label` (names the group), `max`, `size` and `overflowLabel` (`(count) => string`, default `` n => `${n} more` ``; pass Vietnamese, e.g. `` n => `${n} người khác` ``).

## Accessibility

- Each avatar is announced as an image named `name`, whether the photo or the initials show.
- When the name is already printed next to the avatar, pass `aria-hidden` so screen readers do not hear it twice.
- The "+N" bubble is announced as "N more" (or your `overflowLabel`). List everyone in full somewhere reachable, e.g. a members page or a tooltip on a button.
- Give the group a `label` when nothing nearby says who these people are.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type AvatarProps = Omit<BaseUI.Avatar.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Person or team name. Becomes the accessible name and the initials. */
  name: string;
  /** Photo URL. Initials show until it loads, and if it fails. */
  src?: string;
  /** Override the initials taken from `name`. */
  initials?: string;
  /** `sm` 24px, `md` 32px (default), `lg` 40px. */
  size?: AvatarSize;
};
export type AvatarGroupProps = ComponentProps<'div'> & {
  /** Names the group for screen readers, e.g. "Project members". */
  label?: string;
  /** Show at most this many avatars, then a "+N" bubble. */
  max?: number;
  /** Size applied to every avatar in the group. */
  size?: AvatarSize;
  /** Accessible name of the "+N" bubble. Pass a Vietnamese string in Vietnamese UIs. */
  overflowLabel?: (count: number) => string;
};
```
