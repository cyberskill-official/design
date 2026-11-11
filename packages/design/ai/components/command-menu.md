# Command Menu

> A ⌘K palette that filters commands and pages as you type. Accent-insensitive search, keyboard-first, and a hook for the shortcut.

```tsx
import { Button, CommandGroup, CommandItem, CommandMenu, useCommandMenuShortcut } from '@cyberskill/design';
```

Use a command menu to let people jump to any page or run any command from the keyboard. It complements, never replaces, visible navigation. For picking a value in a form use a select or combobox.

## Palette

```tsx
const [open, setOpen] = useState(false);
useCommandMenuShortcut(setOpen); // ⌘K on macOS, Ctrl+K elsewhere

<Button variant="secondary" iconStart={<MagnifyingGlass />} onClick={() => setOpen(true)}>Search…</Button>
<CommandMenu open={open} onOpenChange={setOpen}>
  <CommandGroup label="Go to">
    <CommandItem icon={<House />} onSelect={() => router.push('/')}>Dashboard</CommandItem>
    <CommandItem icon={<Gear />} keywords={['settings', 'preferences']} onSelect={openSettings}>Cài đặt</CommandItem>
  </CommandGroup>
  <CommandGroup label="Actions">
    <CommandItem icon={<Plus />} shortcut="⌘N" onSelect={createAgent}>New agent</CommandItem>
  </CommandGroup>
</CommandMenu>
```

Search matches the item label (or `value`) and its `keywords`, ignoring case and accents: "cai dat" and "settings" both find "Cài đặt". Groups with no match hide, and `emptyLabel` shows when nothing matches. Choosing an item runs `onSelect` and closes the menu.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open / onOpenChange` | `boolean / (open) => void` | – | Controlled open state (required) |
| `placeholder` | `string` | `'Type a command or search…'` | Search box placeholder |
| `emptyLabel` | `ReactNode` | `'No results found.'` | Shown and announced when nothing matches |
| `label` | `string` | `'Command menu'` | Accessible name of the dialog and search box |
| `navigateLabel / selectLabel / closeLabel` | `string` | `'Navigate' / 'Select' / 'Close'` | Footer hints; closeLabel also names a screen-reader close button |
| `label (Group)` | `ReactNode` | – | Group heading (required) |
| `onSelect (Item)` | `() => void` | – | Runs when chosen with Enter or a click |
| `keywords (Item)` | `string[]` | `[]` | Extra search terms: synonyms, other languages |
| `value (Item)` | `string` | `children` | Text to match when children is not a plain string |
| `icon / shortcut (Item)` | `ReactNode` | – | Decorative icon; shortcut hint (display only) |
| `useCommandMenuShortcut(setOpen, key?)` | `hook` | `key = 'k'` | Toggles the menu on ⌘ or Ctrl plus the key |

## Accessibility

- Opens as a modal dialog with focus in the search box, a `combobox` that controls a `listbox` of grouped `option`s.
- Up and Down move the highlight (the first match is highlighted), Enter runs it, Escape closes and returns focus to where it was.
- The no-results message is a polite live region. A visually hidden Close button serves touch screen readers, which have no Escape key.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type ButtonProps = Omit<BaseUI.Button.Props, 'className'> & {
  className?: string;
  /** Visual style. `accent` (gold) is for one key action or AI moment per view. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the button focusable and announces it as busy. */
  loading?: boolean;
  /** Icon before the label (decorative). */
  iconStart?: ReactNode;
  /** Icon after the label (decorative). */
  iconEnd?: ReactNode;
  /** Stretch to the container width. */
  fullWidth?: boolean;
};
type CommandGroupProps = Omit<BaseUI.Autocomplete.Group.Props, 'className'> & {
  className?: string;
  /** Heading above the group, e.g. "Navigation". Hidden with the group when none of its items match. */
  label: ReactNode;
};
type CommandItemProps = Omit<BaseUI.Autocomplete.Item.Props, 'className' | 'value' | 'onClick' | 'onSelect'> & {
  className?: string;
  /** Text the search matches. Defaults to `children` when it is a string. */
  value?: string;
  /** Extra search terms: synonyms, old names, Vietnamese or English equivalents. */
  keywords?: string[];
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** Keyboard shortcut shown at the end, e.g. "⌘N". Display only: wire the shortcut yourself. */
  shortcut?: ReactNode;
  /** Runs when the item is chosen with Enter or a click. The menu then closes. */
  onSelect?: () => void;
type CommandMenuProps = {
  /** Controlled open state. Pair with `useCommandMenuShortcut(setOpen)` for ⌘K / Ctrl+K. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
```
