# Code block

> Read-only code with an optional title, language label and a copy button.

```tsx
import { CodeBlock, CopyButton, Toolbar, ToolbarButton, ToolbarSeparator } from '@cyberskill/design';
```

Use a code block to show code, commands or config that people copy. It shows the text as-is, with no syntax highlighting. For a short value inline in a sentence, use `<code>`.

## Example

```tsx
<CodeBlock code={usage} title="app/save.tsx" language="tsx" />
```

## Variants

No header puts the copy button in the corner. `inverted` is a dark ink surface in both themes. `wrap` wraps long lines instead of scrolling sideways.

```tsx
<CodeBlock code="npm install @cyberskill/design" />
<CodeBlock code={usage} language="tsx" variant="inverted" />
<CodeBlock code={usage} language="tsx" wrap />
```

## Copy button on its own

```tsx
<code>ws_8f3k2q</code>
<CopyButton value="ws_8f3k2q" label="Copy workspace ID" />
```

## In a toolbar

Pass the copy button to a `ToolbarButton`'s `render` so it joins the toolbar's arrow-key navigation (the whole toolbar stays one Tab stop). Name it with CopyButton's own `label`.

```tsx
<Toolbar aria-label="Answer actions">
  <ToolbarButton render={<CopyButton value={answer} label="Copy answer" />} />
  <ToolbarSeparator />
  <ToolbarButton icon={<ThumbsUp />} label="Good answer" />
  <ToolbarButton icon={<ThumbsDown />} label="Bad answer" />
  <ToolbarButton icon={<ArrowClockwise />}>Regenerate</ToolbarButton>
</Toolbar>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | – | CodeBlock: the code to show and copy (required) |
| `title` | `ReactNode` | – | CodeBlock: file name or caption in the header |
| `language` | `string` | – | CodeBlock: small mono label, e.g. "tsx" |
| `variant` | `'raised' \| 'inverted'` | `'raised'` | CodeBlock: surface |
| `wrap` | `boolean` | `false` | CodeBlock: wrap long lines |
| `hideCopy` | `boolean` | `false` | CodeBlock: hide the copy button |
| `copyLabel / copiedLabel` | `string` | `'Copy' / 'Copied'` | CodeBlock: button name and announcement, e.g. "Sao chép" / "Đã sao chép" |
| `value` | `string` | – | CopyButton: text to copy (required) |
| `label / copiedLabel` | `string` | `'Copy' / 'Copied'` | CopyButton: button name and announcement |
| `onCopy` | `(value: string) => void` | – | CopyButton: called after a successful copy |

## Accessibility

- The copy button is named by `copyLabel`. After copying it shows a check mark and announces `copiedLabel` through a polite live region.
- When long lines scroll sideways, the code is focusable so keyboard users can scroll it with the arrow keys.
- Text meets 4.5:1 contrast on both surfaces in light and dark.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type CodeBlockProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & {
  className?: string;
  /** The code, shown as-is (no syntax highlighting) and copied by the copy button. */
  code: string;
  /** File name or caption shown in the header. */
  title?: ReactNode;
  /** Small mono label in the header, e.g. "tsx" or "bash". */
  language?: string;
  /** `raised` sits on the page in both themes; `inverted` is a dark ink surface in both themes. */
  variant?: 'raised' | 'inverted';
  /** Wrap long lines instead of scrolling sideways. */
  wrap?: boolean;
  /** Hide the copy button. */
  hideCopy?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
};
export type CopyButtonProps = Omit<IconButtonProps, 'label' | 'icon' | 'value'> & {
  /** Text written to the clipboard. */
  value: string;
  /** Accessible name of the button, e.g. "Copy" / "Sao chép". */
  label?: string;
  /** Announced politely after a successful copy, e.g. "Copied" / "Đã sao chép". */
  copiedLabel?: string;
  /** Called after the text is on the clipboard. */
  onCopy?: (value: string) => void;
};
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
export type ToolbarSeparatorProps = Omit<BaseUI.Toolbar.Separator.Props, 'className'> & {
  className?: string;
};
```
