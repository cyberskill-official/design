import { Autocomplete } from '@base-ui/react/autocomplete';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { cx } from '../utils/cx';
import { includesFolded } from '../utils/search';
import { ThemedPortal } from './ThemeScope';

type CommandMenuContextValue = { matches: (text: string) => boolean; close: () => void };
const CommandMenuContext = createContext<CommandMenuContextValue>({ matches: () => true, close: () => {} });

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

/**
 * A ⌘K command palette: a search box that filters actions as you type, in a modal dialog.
 * Arrow keys move the highlight, Enter runs it, Escape closes. Matching ignores case and accents ("cai dat" finds "Cài đặt").
 */
export function CommandMenu({
  open,
  onOpenChange,
  shortcut = 'k',
  label = 'Command menu',
  placeholder = 'Type a command or search…',
  emptyLabel = 'No results found.',
  navigateLabel = 'Navigate',
  selectLabel = 'Select',
  closeLabel = 'Close',
  className,
  children,
}: CommandMenuProps) {
  useModifierKey(shortcut, () => onOpenChange(!open));
  return (
    <BaseDialog.Root open={open} onOpenChange={next => onOpenChange(next)}>
      <ThemedPortal part={BaseDialog.Portal}>
        <BaseDialog.Backdrop className="cs-dialog-backdrop" />
        <BaseDialog.Popup aria-label={label} className={cx('cs-command-menu', className)}>
          <CommandSearch label={label} placeholder={placeholder} emptyLabel={emptyLabel} close={() => onOpenChange(false)}>
            {children}
          </CommandSearch>
          <div className="cs-command-menu-footer" aria-hidden="true">
            <span><kbd className="cs-command-menu-kbd">↑</kbd><kbd className="cs-command-menu-kbd">↓</kbd>{navigateLabel}</span>
            <span><kbd className="cs-command-menu-kbd">↵</kbd>{selectLabel}</span>
            <span><kbd className="cs-command-menu-kbd">Esc</kbd>{closeLabel}</span>
          </div>
          <BaseDialog.Close className="cs-command-menu-close">{closeLabel}</BaseDialog.Close>
        </BaseDialog.Popup>
      </ThemedPortal>
    </BaseDialog.Root>
  );
}

/** The search box and list. Lives inside the popup, so its query resets each time the menu opens. */
function CommandSearch({ label, placeholder, emptyLabel, close, children }: Pick<CommandMenuProps, 'label' | 'placeholder' | 'emptyLabel' | 'children'> & { close: () => void }) {
  const [query, setQuery] = useState('');
  // Items filter themselves; read the matching values back from the list (in DOM order) so Base UI keeps
  // the highlight within them and the empty state is known. `null` until the first measure.
  const [matching, setMatching] = useState<string[] | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const values = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [], el => el.dataset.value ?? '');
    setMatching(prev => (prev?.join('\n') === values.join('\n') ? prev : values));
  });

  // Memoized: a new `matching` (read back after each render) must not re-render every item through the context.
  const context = useMemo<CommandMenuContextValue>(() => ({ matches: text => includesFolded(text, query), close }), [query, close]);
  return (
    <Autocomplete.Root
      open
      inline
      value={query}
      filteredItems={matching ?? []}
      onValueChange={(value, details) => details.reason !== 'item-press' && setQuery(value)}
      autoHighlight="always"
      keepHighlight
    >
      <Autocomplete.InputGroup className="cs-command-menu-search">
        <MagnifyingGlass aria-hidden="true" />
        <Autocomplete.Input aria-label={label} placeholder={placeholder} className="cs-command-menu-input" />
      </Autocomplete.InputGroup>
      <Autocomplete.List ref={listRef} className="cs-command-menu-list">
        <CommandMenuContext.Provider value={context}>{children}</CommandMenuContext.Provider>
      </Autocomplete.List>
      <div role="status" className="cs-command-menu-empty">{matching?.length === 0 ? emptyLabel : null}</div>
    </Autocomplete.Root>
  );
}

export type CommandGroupProps = Omit<Autocomplete.Group.Props, 'className'> & {
  className?: string;
  /** Heading above the group, e.g. "Navigation". Hidden with the group when none of its items match. */
  label: ReactNode;
};
export function CommandGroup({ label, className, children, ...props }: CommandGroupProps) {
  return (
    <Autocomplete.Group {...props} className={cx('cs-command-group', className)}>
      <Autocomplete.GroupLabel className="cs-command-group-label">{label}</Autocomplete.GroupLabel>
      {children}
    </Autocomplete.Group>
  );
}

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
export function CommandItem({ value, keywords = [], icon, shortcut, onSelect, className, children, ...props }: CommandItemProps) {
  const { matches, close } = useContext(CommandMenuContext);
  const text = value ?? (typeof children === 'string' ? children : '');
  if (!matches([text, ...keywords].join(' '))) return null;
  return (
    <Autocomplete.Item
      {...props}
      value={text}
      data-value={text}
      onClick={() => {
        onSelect?.();
        close();
      }}
      className={cx('cs-command-item', className)}
    >
      {icon && <span className="cs-command-item-icon" aria-hidden="true">{icon}</span>}
      <span className="cs-command-item-label">{children}</span>
      {shortcut && <kbd className="cs-command-item-shortcut">{shortcut}</kbd>}
    </Autocomplete.Item>
  );
}

/** Runs `onPress` on ⌘ or Ctrl plus `key`, unless another listener already handled the event (so the prop and the hook never toggle twice). */
function useModifierKey(key: string | false, onPress: () => void) {
  useEffect(() => {
    if (!key) return;
    const letter = key.toLowerCase();
    function onKeyDown(event: KeyboardEvent) {
      // `key` is undefined on some synthetic keydowns (Chrome autofill).
      if (event.defaultPrevented || event.key?.toLowerCase() !== letter || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      onPress();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [key, onPress]);
}

/**
 * Toggles the command menu on ⌘K (macOS) or Ctrl+K (Windows, Linux). Pass the `useState` setter; `key` changes the letter.
 * `CommandMenu` already does this through its `shortcut` prop; use the hook only when the menu is not always mounted.
 */
export function useCommandMenuShortcut(setOpen: Dispatch<SetStateAction<boolean>>, key = 'k') {
  useModifierKey(key, () => setOpen(open => !open));
}
