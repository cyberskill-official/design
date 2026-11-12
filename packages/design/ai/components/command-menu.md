# Command Menu

> A ⌘K palette that filters commands and pages as you type. Accent-insensitive search, keyboard-first, with a shortcut you can change or turn off.

```tsx
import { Button, CommandGroup, CommandItem, CommandMenu } from '@cyberskill/design';
```

Use a command menu to let people jump to any page or run any command from the keyboard. It complements, never replaces, visible navigation. For picking a value in a form use a select or combobox.

## Palette

```tsx
const [open, setOpen] = useState(false);

<Button variant="secondary" iconStart={<MagnifyingGlass />} onClick={() => setOpen(true)}>Search…</Button>
{/* ⌘K is this site's search, so the example uses ⌘J; apps usually keep the default 'k' */}
<CommandMenu open={open} onOpenChange={setOpen} shortcut="j">
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

## Shortcut

The menu toggles on ⌘K (macOS) or Ctrl+K (Windows, Linux) by itself. When the page already uses that shortcut, pass another letter, or `false` and open the menu only from a button:

```tsx
<CommandMenu open={open} onOpenChange={setOpen} shortcut="p">…</CommandMenu>   {/* ⌘P / Ctrl+P */}
<CommandMenu open={open} onOpenChange={setOpen} shortcut={false}>…</CommandMenu> {/* no shortcut */}
```

Render the menu only when needed (`{ready && <CommandMenu … />}`)? Then add `useCommandMenuShortcut(setOpen)` where it is always mounted, so the shortcut works before the menu is. The two never toggle twice.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open / onOpenChange` | `boolean / (open) => void` | – | Controlled open state (required) |
| `shortcut` | `string \| false` | `'k'` | Letter that toggles the menu with ⌘ (macOS) or Ctrl; false turns it off, e.g. when the page already uses ⌘K |
| `placeholder` | `string` | `'Type a command or search…'` | Search box placeholder |
| `emptyLabel` | `ReactNode` | `'No results found.'` | Shown and announced when nothing matches |
| `label` | `string` | `'Command menu'` | Accessible name of the dialog and search box |
| `navigateLabel / selectLabel / closeLabel` | `string` | `'Navigate' / 'Select' / 'Close'` | Footer hints; closeLabel also names a screen-reader close button |
| `label (Group)` | `ReactNode` | – | Group heading (required) |
| `onSelect (Item)` | `() => void` | – | Runs when chosen with Enter or a click |
| `keywords (Item)` | `string[]` | `[]` | Extra search terms: synonyms, other languages |
| `value (Item)` | `string` | `children` | Text to match when children is not a plain string |
| `icon / shortcut (Item)` | `ReactNode` | – | Decorative icon; shortcut hint (display only) |
| `useCommandMenuShortcut(setOpen, key?)` | `hook` | `key = 'k'` | The same shortcut for a menu that is not always mounted. Ignores keydown events with no key (browser autofill) and ones the menu already handled |

## Accessibility

- Opens as a modal dialog with focus in the search box, a `combobox` that controls a `listbox` of grouped `option`s.
- Up and Down move the highlight (the first match is highlighted), Enter runs it, Escape closes and returns focus to where it was.
- The no-results message is a polite live region. A visually hidden Close button serves touch screen readers, which have no Escape key.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ButtonProps = Omit<BaseUI.Button.Props, 'className'> & {
  className?: string;
  /** Visual style. `accent` (gold) is for one key action or AI moment per view. `secondary` is a soft ink fill; `soft` is the same fill in any `tone`. */
  variant?: ButtonVariant;
  /** Tint of a `soft` button, e.g. `success` for Approve or `danger` for a quiet Remove. Ignored by other variants. */
  tone?: 'primary' | 'accent' | StatusTone;
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
export type CommandGroupProps = Omit<Autocomplete.Group.Props, 'className'> & {
  className?: string;
  /** Heading above the group, e.g. "Navigation". Hidden with the group when none of its items match. */
  label: ReactNode;
};
export type CommandItemProps = Omit<Autocomplete.Item.Props, 'className' | 'value' | 'onClick' | 'onSelect'> & {
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
};
export type CommandMenuProps = {
  /** Controlled open state. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Letter that toggles the menu with ⌘ (macOS) or Ctrl (Windows, Linux). Pick another letter, or `false` to turn
   * the shortcut off, when the page already uses ⌘K (e.g. a docs site's search).
   */
  shortcut?: string | false;
  /** Accessible name of the palette and its search box. */
  label?: string;
  placeholder?: string;
  /** Shown (and announced) when nothing matches the search. */
  emptyLabel?: ReactNode;
  /** Footer hint and screen reader close button texts. Pass Vietnamese strings in Vietnamese UIs. */
  navigateLabel?: string;
  selectLabel?: string;
  closeLabel?: string;
  className?: string;
  /** `CommandGroup`s and `CommandItem`s. */
  children: ReactNode;
};
```
