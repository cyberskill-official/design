import { Popover } from '@base-ui/react/popover';
import { CalendarBlank, X } from '@phosphor-icons/react';
import { useRef, useState, type FocusEventHandler, type ReactNode, type Ref } from 'react';
import { useDraft } from './picker-state';
import { IconButton } from '../react/Button';
import { Field, Input, type FieldProps } from '../react/Field';
import { cx } from '../utils/cx';
import { ThemedPortal } from '../react/ThemeScope';

/** Field props every date picker shares. */
export type PickerFieldProps = Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel' | 'required' | 'disabled'> & {
  className?: string;
  /** Input placeholder. Defaults to the display format, e.g. `dd/mm/yyyy`. */
  placeholder?: string;
  /** Shown when the typed text is not a valid date (or is outside min/max). Pass Vietnamese in Vietnamese UIs. */
  invalidMessage?: ReactNode;
  /** Accessible name of the clear (×) button. */
  clearLabel?: string;
  /** Accessible name of the calendar button and of the calendar popup. */
  openLabel?: string;
  /** Submits the value with a native form as a hidden input: `yyyy-MM-dd` (empty while there is no valid value). */
  name?: string;
  /** Ref to the visible text input, e.g. React Hook Form's `field.ref` so a failed submit focuses it. */
  inputRef?: Ref<HTMLInputElement>;
  /** Called when the visible input loses focus, after the typed text is checked (React Hook Form's `field.onBlur`). */
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

type Props<T> = Omit<PickerFieldProps, 'name'> & {
  value: T | null;
  /** Hidden inputs for native form submission, `{ name: value }`. */
  formFields?: Record<string, string>;
  /** Called with a parsed value, or `null` when cleared or when the typed text is invalid. */
  onCommit: (value: T | null) => void;
  toText: (value: T) => string;
  /** `null` when the text is not a valid value. */
  fromText: (text: string) => T | null;
  /** Popup content. `select(value)` commits and closes. Mounted only while open. */
  children: (select: (value: T | null) => void) => ReactNode;
};

/**
 * Internal: labelled text input + clear + calendar button + Base UI Popover. Typed text is parsed on blur and Enter;
 * invalid text stays in the field with `invalidMessage` and commits `null`, so a form never keeps the old value.
 */
export function PickerField<T>({ value, formFields, onCommit, toText, fromText, children, label, hideLabel, description, error, optionalLabel, required, disabled, className, placeholder, invalidMessage = 'Enter a valid date', clearLabel = 'Clear date', openLabel = 'Choose date', inputRef: externalRef, onBlur }: Props<T>) {
  const [open, setOpen] = useState(false);
  const shown = value == null ? '' : toText(value);
  const { draft, setDraft, invalid, setInvalid } = useDraft(shown);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const text = draft ?? shown;

  const select = (next: T | null) => {
    setDraft(null);
    setInvalid(false);
    onCommit(next);
    setOpen(false);
  };
  const commit = () => {
    if (draft == null) return;
    const next = draft.trim() ? fromText(draft) : null;
    if (draft.trim() && next == null) {
      setInvalid(true);
      onCommit(null);
    } else select(next);
  };
  const setInputRef = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof externalRef === 'function') externalRef(el);
    else if (externalRef) externalRef.current = el;
  };

  return (
    <Field label={label} hideLabel={hideLabel} description={description} optionalLabel={optionalLabel} required={required} disabled={disabled} error={error ?? (invalid ? invalidMessage : undefined)} className={cx('cs-date-picker', className)}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Input
          ref={setInputRef}
          value={text}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          onChange={e => setDraft(e.target.value)}
          onBlur={e => {
            commit();
            onBlur?.(e);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') commit();
            if (e.key === 'ArrowDown' && e.altKey) {
              e.preventDefault();
              commit();
              setOpen(true);
            }
          }}
          endAdornment={
            <>
              {text && !disabled && <IconButton variant="ghost" size="sm" label={clearLabel} icon={<X />} onClick={() => { select(null); inputRef.current?.focus(); }} />}
              <Popover.Trigger disabled={disabled} render={<IconButton variant="ghost" size="sm" label={openLabel} icon={<CalendarBlank />} />} />
            </>
          }
        />
        <ThemedPortal part={Popover.Portal}>
          <Popover.Positioner className="cs-date-picker-positioner" anchor={inputRef} align="start" sideOffset={8}>
            <Popover.Popup
              ref={popupRef}
              aria-label={openLabel}
              className="cs-date-picker-popup"
              // Land on the selected day (or today), the grid's single tab stop, instead of the month buttons.
              initialFocus={() => popupRef.current?.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]') ?? true}
            >
              {children(select)}
            </Popover.Popup>
          </Popover.Positioner>
        </ThemedPortal>
      </Popover.Root>
      {formFields && Object.entries(formFields).map(([n, v]) => <input key={n} type="hidden" name={n} value={v} disabled={disabled} />)}
    </Field>
  );
}
