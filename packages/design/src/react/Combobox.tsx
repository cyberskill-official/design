import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CaretUpDown, Check, X } from '@phosphor-icons/react';
import { useMemo, type FocusEventHandler, type ReactNode, type Ref } from 'react';
import { cx } from '../utils/cx';
import { Field, type FieldProps } from './Field';
import { ThemedPortal } from './ThemeScope';

export type ComboboxItem = {
  /** Stored and submitted value, e.g. an ID. */
  value: string;
  /** Text shown in the list and in the input once chosen; also what typing filters on. */
  label: string;
  /** Second line under the label, e.g. an email or a region code. */
  description?: ReactNode;
  disabled?: boolean;
};
export type ComboboxSize = 'sm' | 'md' | 'lg';

/** Props the single and multiple pickers share. */
type PickerProps<Item extends ComboboxItem> = {
  /** Options in display order. */
  items: Item[];
  /** Custom content for each option (the check mark and description are kept). Defaults to `item.label`. */
  children?: (item: Item) => ReactNode;
  placeholder?: string;
  size?: ComboboxSize;
  /** Shown when nothing matches the typed text. Pass Vietnamese text in Vietnamese UIs. */
  emptyText?: ReactNode;
  /** Class for the input box. */
  className?: string;
  /** Ref to the text input (what form libraries focus on error). */
  ref?: Ref<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Accessible name when there is no visible label. Prefer the `…Field` variant. */
  'aria-label'?: string;
  /** Accessible name of the button that opens the list. */
  triggerLabel?: string;
};

export type ComboboxProps<Item extends ComboboxItem = ComboboxItem> = Omit<BaseCombobox.Root.Props<string, false, Item>, 'items' | 'children' | 'multiple'> &
  PickerProps<Item> & {
    /** Shows a spinner and `loadingText` in the list and marks it busy, for async search. */
    loading?: boolean;
    loadingText?: ReactNode;
    /** Accessible name of the clear (×) button. */
    clearLabel?: string;
  };

/** Wraps `items` so `value` / `onValueChange` use `item.value` while the list renders whole items. */
export function useComboboxItems<Item extends ComboboxItem>(items: Item[]) {
  // `as never`: with a generic Item, TypeScript cannot evaluate Base UI's "no group-shaped items" check.
  return useMemo(() => BaseCombobox.createItems<Item, string>(items as never, { getValue: item => item.value, getLabel: item => item.label }), [items]);
}

/** One option row: label, optional description, check mark when selected. Shared with MultiSelect. */
export function renderComboboxItem<Item extends ComboboxItem>(item: Item, children?: (item: Item) => ReactNode, disabled = item.disabled) {
  return (
    <BaseCombobox.Item key={item.value} value={item.value} disabled={disabled} className="cs-combobox-item">
      <span className="cs-combobox-item-text">
        <span className="cs-combobox-item-label">{children ? children(item) : item.label}</span>
        {item.description != null && <span className="cs-combobox-item-description">{item.description}</span>}
      </span>
      <BaseCombobox.ItemIndicator className="cs-combobox-item-indicator">
        <Check aria-hidden="true" />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

type ComboboxPopupProps = { size: ComboboxSize; emptyText: ReactNode; loading?: boolean; loadingText?: ReactNode; children: BaseCombobox.List.Props['children'] };

/** The floating list with empty and loading messages. Shared with MultiSelect. */
export function ComboboxPopup({ size, emptyText, loading, loadingText, children }: ComboboxPopupProps) {
  return (
    <ThemedPortal part={BaseCombobox.Portal}>
      <BaseCombobox.Positioner className="cs-combobox-positioner" side="bottom" align="start" sideOffset={4}>
        <BaseCombobox.Popup className="cs-combobox-popup" data-size={size} aria-busy={loading || undefined}>
          {/* Status and Empty stay mounted so screen readers announce changes; only their content toggles. */}
          <BaseCombobox.Status>
            {loading && (
              <div className="cs-combobox-message">
                <span className="cs-combobox-spinner" aria-hidden="true" />
                {loadingText}
              </div>
            )}
          </BaseCombobox.Status>
          <BaseCombobox.Empty>{!loading && emptyText != null && <div className="cs-combobox-message">{emptyText}</div>}</BaseCombobox.Empty>
          <BaseCombobox.List className="cs-combobox-list">{children}</BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </ThemedPortal>
  );
}

/** Searchable single-choice picker: type to filter, arrow keys to move, Enter to choose. Use `ComboboxField` for a labelled field. */
export function Combobox<Item extends ComboboxItem = ComboboxItem>({
  items,
  children,
  placeholder,
  size = 'md',
  emptyText = 'No results',
  loading = false,
  loadingText = 'Loading…',
  clearLabel = 'Clear',
  triggerLabel = 'Show options',
  className,
  ref,
  onBlur,
  'aria-label': ariaLabel,
  ...props
}: ComboboxProps<Item>) {
  const collection = useComboboxItems(items);
  return (
    <BaseCombobox.Root {...props} items={collection}>
      <BaseCombobox.InputGroup data-size={size} className={cx('cs-input-group', 'cs-combobox', className)}>
        <BaseCombobox.Input ref={ref} onBlur={onBlur} aria-label={ariaLabel} placeholder={placeholder} data-size={size} className="cs-input" />
        <span className="cs-combobox-actions">
          <BaseCombobox.Clear aria-label={clearLabel} className="cs-combobox-action">
            <X aria-hidden="true" />
          </BaseCombobox.Clear>
          <BaseCombobox.Trigger aria-label={triggerLabel} className="cs-combobox-action">
            <CaretUpDown aria-hidden="true" />
          </BaseCombobox.Trigger>
        </span>
      </BaseCombobox.InputGroup>
      <ComboboxPopup size={size} emptyText={emptyText} loading={loading} loadingText={loadingText}>
        {(item: Item) => renderComboboxItem(item, children)}
      </ComboboxPopup>
    </BaseCombobox.Root>
  );
}

export type ComboboxFieldProps<Item extends ComboboxItem = ComboboxItem> = ComboboxProps<Item> &
  Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & { fieldClassName?: string };

/** The common case: a labelled combobox with optional help and error text, wired like `TextField`. */
export function ComboboxField<Item extends ComboboxItem = ComboboxItem>({ label, hideLabel, description, error, optionalLabel, required, disabled, name, fieldClassName, ...props }: ComboboxFieldProps<Item>) {
  return (
    <Field label={label} hideLabel={hideLabel} description={description} error={error} optionalLabel={optionalLabel} required={required} disabled={disabled} name={name} className={fieldClassName}>
      <Combobox {...props} required={required} disabled={disabled} name={name} />
    </Field>
  );
}
