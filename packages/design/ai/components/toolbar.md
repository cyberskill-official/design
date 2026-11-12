# Toolbar

> A row of related controls that is one Tab stop, with arrow-key navigation inside.

```tsx
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator } from '@cyberskill/design';
```

Use a toolbar for a compact set of commands that act on one thing: an editor's formatting, a canvas's tools, a table's bulk actions. For a single row of page actions, plain buttons are simpler.

## Example

Icon-only buttons take an `icon` and a `label` (their accessible name). Toggles pass `aria-pressed`.

```tsx
<Toolbar aria-label="Text formatting">
  <ToolbarGroup aria-label="History">
    <ToolbarButton icon={<ArrowCounterClockwise />} label="Undo" />
    <ToolbarButton icon={<ArrowClockwise />} label="Redo" disabled />
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarGroup aria-label="Text style">
    <ToolbarButton icon={<TextB />} label="Bold" aria-pressed={bold} onClick={toggleBold} />
    <ToolbarButton icon={<TextItalic />} label="Italic" aria-pressed={italic} onClick={toggleItalic} />
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarButton icon={<LinkIcon />}>Insert link</ToolbarButton>
  <ToolbarLink href="/help">Help</ToolbarLink>
</Toolbar>
```

## Vertical

```tsx
<Toolbar aria-label="Canvas tools" orientation="vertical">
  <ToolbarButton icon={<TextB />} label="Bold" />
  <ToolbarButton icon={<TextItalic />} label="Italic" />
  <ToolbarSeparator />
  <ToolbarButton icon={<ListBullets />} label="Bulleted list" />
</Toolbar>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Toolbar: direction and which arrow keys move focus |
| `loopFocus` | `boolean` | `true` | Toolbar: wrap from the last item to the first |
| `icon` | `ReactNode` | – | ToolbarButton: decorative icon, or the only content |
| `label` | `string` | – | ToolbarButton: accessible name, required when icon-only |
| `disabled` | `boolean` | `false` | ToolbarButton or ToolbarGroup: inert but still focusable |
| `render` | `ReactElement` | – | ToolbarButton: make it a Menu, Popover or Dialog trigger, or another button such as <CopyButton />, so it joins the arrow keys |

## Accessibility

- The toolbar is one Tab stop. Arrow keys (Left/Right, or Up/Down when vertical) move between items and wrap at the ends.
- Name the toolbar with `aria-label`; groups can be named too.
- Disabled buttons stay focusable with `aria-disabled`, so people can still find them.
- Icon-only buttons are named by `label` and keep a 44px touch area.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ToolbarProps = Omit<BaseUI.Toolbar.Root.Props, 'className'> & {
  className?: string;
};
export type ToolbarButtonProps = Omit<BaseUI.Toolbar.Button.Props, 'className'> & {
  className?: string;
  /** Icon before the text, or the only content when the button has no children (decorative). */
  icon?: ReactNode;
  /** Accessible name. Required for icon-only buttons, e.g. "Bold" / "In đậm". */
  label?: string;
};
export type ToolbarGroupProps = Omit<BaseUI.Toolbar.Group.Props, 'className'> & {
  className?: string;
};
export type ToolbarLinkProps = Omit<BaseUI.Toolbar.Link.Props, 'className'> & {
  className?: string;
};
export type ToolbarSeparatorProps = Omit<BaseUI.Toolbar.Separator.Props, 'className'> & {
  className?: string;
};
```
