import { Field as BaseField } from '@base-ui/react/field';
import { Select as BaseSelect } from '@base-ui/react/select';
import { CaretUpDown, Check, WarningCircle } from '@phosphor-icons/react';
import type { FocusEventHandler, ReactNode, Ref } from 'react';
import { cx } from '../utils/cx';
import type { FieldProps } from './Field';
import { ThemedPortal } from './ThemeScope';

export type SelectItem<Value = string> = { value: Value; label: ReactNode; disabled?: boolean };
/** A titled section of options in the list. */
export type SelectGroup<Value = string> = { label: ReactNode; items: SelectItem<Value>[] };
export type SelectSize = 'sm' | 'md' | 'lg';

const isGroup = <Value,>(entry: SelectItem<Value> | SelectGroup<Value>): entry is SelectGroup<Value> => 'items' in entry && Array.isArray(entry.items);

// Keyed by position: values may be objects, which all stringify to "[object Object]".
function renderItem<Value>(item: SelectItem<Value>, index: number) {
  return (
    <BaseSelect.Item key={index} value={item.value} disabled={item.disabled} className="cs-select-item">
      <BaseSelect.ItemText className="cs-select-item-text">{item.label}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="cs-select-item-indicator">
        <Check aria-hidden="true" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export type SelectProps<Value = string> = Omit<BaseSelect.Root.Props<Value>, 'items' | 'children' | 'multiple'> & {
  /** Options in display order, optionally in titled groups (`{ label, items }`). `label` is shown in the list and in the trigger once chosen. */
  items: (SelectItem<Value> | SelectGroup<Value>)[];
  /** Shown in the trigger while nothing is chosen, e.g. "Choose a plan". */
  placeholder?: ReactNode;
  size?: SelectSize;
  /** Class for the trigger button. */
  className?: string;
  /** Ref to the trigger button (what form libraries focus on error). */
  ref?: Ref<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  /** Accessible name when there is no visible label. Prefer `SelectField`. */
  'aria-label'?: string;
};

/** Single-choice dropdown. Keyboard, typeahead and positioning come from Base UI. Use `SelectField` for a labelled field. */
export function Select<Value = string>({ items, placeholder, size = 'md', className, ref, onBlur, 'aria-label': ariaLabel, ...props }: SelectProps<Value>) {
  // Base UI reads labels from all-flat or all-grouped lists; flattening lets groups and loose options mix.
  const options = items.flatMap(entry => (isGroup(entry) ? entry.items : [entry]));
  return (
    <BaseSelect.Root {...props} items={options}>
      <BaseSelect.Trigger ref={ref} onBlur={onBlur} aria-label={ariaLabel} data-size={size} className={cx('cs-select', className)}>
        <BaseSelect.Value className="cs-select-value" placeholder={placeholder} />
        <BaseSelect.Icon className="cs-select-icon">
          <CaretUpDown aria-hidden="true" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <ThemedPortal part={BaseSelect.Portal}>
        <BaseSelect.Positioner className="cs-select-positioner" alignItemWithTrigger={false} side="bottom" align="start" sideOffset={4}>
          <BaseSelect.Popup className="cs-select-popup" data-size={size}>
            <BaseSelect.List className="cs-select-list">
              {items.map((entry, i) =>
                isGroup(entry) ? (
                  <BaseSelect.Group key={`group-${i}`} className="cs-select-group">
                    <BaseSelect.GroupLabel className="cs-select-group-label">{entry.label}</BaseSelect.GroupLabel>
                    {entry.items.map(renderItem)}
                  </BaseSelect.Group>
                ) : (
                  renderItem(entry, i)
                ),
              )}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </ThemedPortal>
    </BaseSelect.Root>
  );
}

// Same error markup as Field: an icon beside the message so it does not rest on color; aria-hidden keeps the text as the description.
const renderError: BaseField.Error.Props['render'] = ({ children, ...props }) => (
  <div {...props}>
    <WarningCircle aria-hidden="true" />
    <span>{children}</span>
  </div>
);

export type SelectFieldProps<Value = string> = SelectProps<Value> &
  Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & { fieldClassName?: string };

/** The common case: a labelled select with optional help and error text, wired like `TextField`. */
export function SelectField<Value = string>({ label, hideLabel, description, error, optionalLabel, required, disabled, name, fieldClassName, ...selectProps }: SelectFieldProps<Value>) {
  const isInvalid = error != null && error !== false;
  return (
    <BaseField.Root invalid={isInvalid} disabled={disabled} name={name} className={cx('cs-field', fieldClassName)}>
      {/* A non-native label: clicking it focuses the trigger without opening the list, like a native <select>. */}
      <BaseField.Label nativeLabel={false} render={<div />} className={cx('cs-field-label', hideLabel && 'cs-visually-hidden')}>
        {label}
        {required && <span className="cs-field-required" aria-hidden="true">*</span>}
        {!required && optionalLabel && <span className="cs-field-optional">{optionalLabel}</span>}
      </BaseField.Label>
      <Select {...selectProps} required={required} disabled={disabled} />
      {description && <BaseField.Description className="cs-field-description">{description}</BaseField.Description>}
      {isInvalid ? (
        <BaseField.Error className="cs-field-error" render={renderError} match>
          {error}
        </BaseField.Error>
      ) : (
        <BaseField.Error className="cs-field-error" render={renderError} />
      )}
    </BaseField.Root>
  );
}
