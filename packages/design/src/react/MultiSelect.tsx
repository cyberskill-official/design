import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { CaretUpDown, X } from '@phosphor-icons/react';
import { useState } from 'react';
import { cx } from '../utils/cx';
import { includesFolded } from '../utils/search';
import { ComboboxPopup, renderComboboxItem, useComboboxItems, type ComboboxItem, type ComboboxProps } from './Combobox';
import { Field, type FieldProps } from './Field';

type SharedProps<Item extends ComboboxItem> = Pick<
  ComboboxProps<Item>,
  'items' | 'children' | 'placeholder' | 'size' | 'emptyText' | 'className' | 'ref' | 'onBlur' | 'aria-label' | 'triggerLabel'
>;

export type MultiSelectProps<Item extends ComboboxItem = ComboboxItem> = Omit<
  BaseCombobox.Root.Props<string, true, Item>,
  'items' | 'children' | 'multiple' | 'value' | 'defaultValue' | 'onValueChange'
> &
  SharedProps<Item> & {
    /** Selected item values. Use with `onValueChange` when controlled. */
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[], eventDetails: BaseCombobox.Root.ChangeEventDetails) => void;
    /** Most values that can be chosen; other options are disabled once it is reached. */
    max?: number;
    /** Show at most this many chips and a "+N" count for the rest. */
    maxChips?: number;
    /** Accessible name of each chip's remove button. Pass Vietnamese text in Vietnamese UIs. */
    removeLabel?: (label: string) => string;
  };

/** Searchable multi-choice picker. Chosen values show as removable chips in the input; Backspace removes the last one. */
export function MultiSelect<Item extends ComboboxItem = ComboboxItem>({
  items,
  children,
  placeholder,
  size = 'md',
  emptyText = 'No results',
  triggerLabel = 'Show options',
  removeLabel = label => `Remove ${label}`,
  value,
  defaultValue,
  onValueChange,
  max,
  maxChips,
  className,
  ref,
  onBlur,
  'aria-label': ariaLabel,
  ...props
}: MultiSelectProps<Item>) {
  const collection = useComboboxItems(items);
  // Mirror the value so `max` can disable options and chips can show labels, controlled or not.
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? []);
  const selected = value ?? uncontrolled;
  const labelOf = (v: string) => items.find(item => item.value === v)?.label ?? v;
  const full = max != null && selected.length >= max;
  const chips = maxChips == null ? selected : selected.slice(0, maxChips);
  const hidden = selected.length - chips.length;

  return (
    <BaseCombobox.Root
      filter={(item: Item, query: string) => includesFolded(item.label, query)}
      {...props}
      multiple
      items={collection}
      value={selected}
      onValueChange={(next, details) => {
        setUncontrolled(next);
        onValueChange?.(next, details);
      }}
    >
      <BaseCombobox.InputGroup data-size={size} className={cx('cs-input-group', 'cs-combobox', 'cs-multi-select', className)}>
        <BaseCombobox.Chips className="cs-multi-select-chips">
          {chips.map(v => (
            <BaseCombobox.Chip key={v} className="cs-multi-select-chip">
              <span className="cs-multi-select-chip-label">{labelOf(v)}</span>
              <BaseCombobox.ChipRemove aria-label={removeLabel(labelOf(v))} className="cs-multi-select-chip-remove">
                <X aria-hidden="true" />
              </BaseCombobox.ChipRemove>
            </BaseCombobox.Chip>
          ))}
          {hidden > 0 && <span className="cs-multi-select-more">+{hidden}</span>}
          <BaseCombobox.Input
            ref={ref}
            onBlur={onBlur}
            onKeyDown={event => {
              // Base UI empties the whole selection on Escape while the list is closed. With chips that throws away the
              // user's work (and with reduced motion the Escape that closes the list already counts as closed), so Escape only dismisses.
              if (event.key === 'Escape' && selected.length > 0 && event.currentTarget.getAttribute('aria-expanded') !== 'true') event.preventBaseUIHandler();
            }}
            aria-label={ariaLabel}
            placeholder={selected.length ? undefined : placeholder}
            className="cs-multi-select-input"
          />
        </BaseCombobox.Chips>
        <span className="cs-combobox-actions">
          <BaseCombobox.Trigger aria-label={triggerLabel} className="cs-combobox-action">
            <CaretUpDown aria-hidden="true" />
          </BaseCombobox.Trigger>
        </span>
      </BaseCombobox.InputGroup>
      <ComboboxPopup size={size} emptyText={emptyText}>
        {(item: Item) => renderComboboxItem(item, children, item.disabled || (full && !selected.includes(item.value)))}
      </ComboboxPopup>
    </BaseCombobox.Root>
  );
}

export type MultiSelectFieldProps<Item extends ComboboxItem = ComboboxItem> = MultiSelectProps<Item> &
  Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & { fieldClassName?: string };

/** The common case: a labelled multi-select with optional help and error text, wired like `TextField`. */
export function MultiSelectField<Item extends ComboboxItem = ComboboxItem>({ label, hideLabel, description, error, optionalLabel, required, disabled, name, fieldClassName, ...props }: MultiSelectFieldProps<Item>) {
  return (
    <Field label={label} hideLabel={hideLabel} description={description} error={error} optionalLabel={optionalLabel} required={required} disabled={disabled} name={name} className={fieldClassName}>
      <MultiSelect {...props} required={required} disabled={disabled} name={name} />
    </Field>
  );
}
