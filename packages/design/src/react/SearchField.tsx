import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useState } from 'react';
import { Field, Input, type FieldProps, type InputProps } from './Field';
import { Kbd } from './Kbd';
import { Spinner } from './Spinner';
import { cx } from '../utils/cx';

export type SearchFieldProps = Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onValueChange' | 'startAdornment' | 'endAdornment'> &
  Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error'> & {
    /** The search text, controlled. */
    value?: string;
    /** The initial search text, uncontrolled. */
    defaultValue?: string;
    /** Called with the new text on typing, the clear button and Escape. */
    onValueChange?: (value: string) => void;
    /** Accessible name of the clear (×) button, e.g. "Xoá tìm kiếm". */
    clearLabel?: string;
    /** Shows a spinner while results load. */
    loading?: boolean;
    /** Announced while `loading`, e.g. "Đang tải". */
    loadingLabel?: string;
    /** Key hint shown while the field is empty, e.g. "⌘K" or "/". Display only: wire the shortcut yourself. */
    shortcut?: string;
    /** Class for the field wrapper; `className` goes to the input. */
    fieldClassName?: string;
  };

/** Labelled search input: a search glass, a clear button once there is text, Escape to clear, and optional loading and shortcut hints. */
export function SearchField({
  label, hideLabel, description, error, value, defaultValue = '', onValueChange, clearLabel = 'Clear search', loading = false, loadingLabel = 'Loading',
  shortcut, size = 'md', disabled, name, fieldClassName, onKeyDown, ...inputProps
}: SearchFieldProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const text = value ?? uncontrolled;
  const change = (next: string) => {
    setUncontrolled(next);
    onValueChange?.(next);
  };
  const end = (loading || (text && !disabled) || (shortcut && !text)) && (
    <>
      {loading && <Spinner size="sm" label={loadingLabel} />}
      {text && !disabled ? (
        <button
          type="button"
          className="cs-search-field-clear"
          aria-label={clearLabel}
          onClick={event => {
            change('');
            event.currentTarget.closest('.cs-input-group')?.querySelector('input')?.focus();
          }}
        >
          <X aria-hidden="true" />
        </button>
      ) : (
        shortcut && <Kbd aria-hidden="true">{shortcut}</Kbd>
      )}
    </>
  );
  return (
    <Field label={label} hideLabel={hideLabel} description={description} error={error} disabled={disabled} name={name} className={cx('cs-search-field', fieldClassName)}>
      <Input
        {...inputProps}
        type="search"
        size={size}
        value={text}
        onValueChange={change}
        onKeyDown={event => {
          // Escape clears first; with nothing to clear it bubbles up (e.g. to close a dialog).
          if (event.key === 'Escape' && text) {
            event.preventDefault();
            event.stopPropagation();
            change('');
          }
          onKeyDown?.(event);
        }}
        startAdornment={<MagnifyingGlass aria-hidden="true" />}
        endAdornment={end || undefined}
      />
    </Field>
  );
}
