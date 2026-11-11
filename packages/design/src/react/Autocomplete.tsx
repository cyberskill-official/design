import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import type { FocusEventHandler, ReactNode, Ref } from 'react';
import { cx } from '../utils/cx';
import { foldText, includesFolded } from '../utils/search';
import { ThemedPortal } from './ThemeScope';

/** A suggestion: plain text, or `{ value, label }` where `label` is what fills the input. */
export type AutocompleteItem = string | { value: string; label: string; description?: ReactNode };
/** A titled section of suggestions. */
export type AutocompleteGroup = { label: string; items: AutocompleteItem[] };
export type AutocompleteSize = 'sm' | 'md' | 'lg';

export type AutocompleteProps = Omit<BaseAutocomplete.Root.Props<AutocompleteItem>, 'items' | 'children'> & {
  /** Suggestions, flat or in groups (`{ label, items }`). Typing filters them, ignoring case and accents (NFC or NFD). */
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

const labelOf = (item: AutocompleteItem) => (typeof item === 'string' ? item : item.label);
const isGroup = (entry: AutocompleteItem | AutocompleteGroup): entry is AutocompleteGroup => typeof entry === 'object' && 'items' in entry;

/** Wraps the first match of `query` in `text` with <mark>, ignoring case and accents ("dang" marks "Đặng"). */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = foldText(query.trim());
  if (!q) return text;
  // Composed first, so an accent never splits from its letter at the edge of the mark. Folded per character so indexes map back.
  const chars = Array.from(text.normalize('NFC'));
  let folded = '';
  const starts = chars.map(c => {
    const at = folded.length;
    folded += foldText(c);
    return at;
  });
  const at = folded.indexOf(q);
  if (at < 0) return text;
  const from = starts.findIndex(s => s >= at);
  const to = starts.findIndex(s => s >= at + q.length);
  const end = to < 0 ? chars.length : to;
  return (
    <>
      {chars.slice(0, from).join('')}
      <mark className="cs-autocomplete-match">{chars.slice(from, end).join('')}</mark>
      {chars.slice(end).join('')}
    </>
  );
}

function renderItem(item: AutocompleteItem, highlight: boolean) {
  const label = labelOf(item);
  return (
    <BaseAutocomplete.Item key={typeof item === 'string' ? item : item.value} value={item} className="cs-combobox-item">
      <span className="cs-combobox-item-text">
        <span className="cs-combobox-item-label">{highlight ? <BaseAutocomplete.Value>{query => <Highlight text={label} query={query} />}</BaseAutocomplete.Value> : label}</span>
        {typeof item === 'object' && item.description != null && <span className="cs-combobox-item-description">{item.description}</span>}
      </span>
    </BaseAutocomplete.Item>
  );
}

/** Free-text search input with a suggestion list. The value is the typed text; picking a suggestion fills it in. */
export function Autocomplete({
  items,
  placeholder,
  size = 'md',
  icon = <MagnifyingGlass />,
  highlightMatches = true,
  emptyText = 'No results',
  clearLabel = 'Clear',
  className,
  ref,
  onBlur,
  'aria-label': ariaLabel,
  ...props
}: AutocompleteProps) {
  return (
    // Base UI types flat and grouped items as separate overloads; the union is valid at runtime.
    <BaseAutocomplete.Root filter={(item: AutocompleteItem, query: string) => includesFolded(labelOf(item), query)} {...props} items={items as AutocompleteItem[]}>
      <BaseAutocomplete.InputGroup data-size={size} className={cx('cs-input-group', 'cs-combobox', 'cs-autocomplete', className)}>
        {icon != null && <span className="cs-input-adornment" data-side="start" aria-hidden="true">{icon}</span>}
        <BaseAutocomplete.Input ref={ref} onBlur={onBlur} aria-label={ariaLabel} placeholder={placeholder} data-size={size} className="cs-input" />
        <span className="cs-combobox-actions">
          <BaseAutocomplete.Clear aria-label={clearLabel} className="cs-combobox-action">
            <X aria-hidden="true" />
          </BaseAutocomplete.Clear>
        </span>
      </BaseAutocomplete.InputGroup>
      <ThemedPortal part={BaseAutocomplete.Portal}>
        <BaseAutocomplete.Positioner className="cs-combobox-positioner" side="bottom" align="start" sideOffset={4}>
          <BaseAutocomplete.Popup className="cs-combobox-popup" data-size={size}>
            <BaseAutocomplete.Empty>{emptyText != null && <div className="cs-combobox-message">{emptyText}</div>}</BaseAutocomplete.Empty>
            <BaseAutocomplete.List className="cs-combobox-list">
              {(entry: AutocompleteItem | AutocompleteGroup) =>
                isGroup(entry) ? (
                  <BaseAutocomplete.Group key={entry.label} items={entry.items} className="cs-combobox-group">
                    <BaseAutocomplete.GroupLabel className="cs-combobox-group-label">{entry.label}</BaseAutocomplete.GroupLabel>
                    <BaseAutocomplete.Collection>{(item: AutocompleteItem) => renderItem(item, highlightMatches)}</BaseAutocomplete.Collection>
                  </BaseAutocomplete.Group>
                ) : (
                  renderItem(entry, highlightMatches)
                )
              }
            </BaseAutocomplete.List>
          </BaseAutocomplete.Popup>
        </BaseAutocomplete.Positioner>
      </ThemedPortal>
    </BaseAutocomplete.Root>
  );
}
