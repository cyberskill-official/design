import { Popover } from '@base-ui/react/popover';
import { CalendarBlank, X } from '@phosphor-icons/react';
import { useRef, useState, type ReactNode } from 'react';
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
};

type Props<T> = PickerFieldProps & {
  value: T | null;
  /** Called with a parsed value, or `null` when cleared. */
  onCommit: (value: T | null) => void;
  toText: (value: T) => string;
  /** `null` when the text is not a valid value. */
  fromText: (text: string) => T | null;
  /** Popup content. `select(value)` commits and closes. Mounted only while open. */
  children: (select: (value: T | null) => void) => ReactNode;
};

/** Internal: labelled text input + clear + calendar button + Base UI Popover. Typed text is parsed on blur and Enter. */
export function PickerField<T>({ value, onCommit, toText, fromText, children, label, hideLabel, description, error, optionalLabel, required, disabled, className, placeholder, invalidMessage = 'Enter a valid date', clearLabel = 'Clear date', openLabel = 'Choose date' }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null); // null: show the formatted value
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const text = draft ?? (value == null ? '' : toText(value));

  const select = (next: T | null) => {
    setDraft(null);
    setInvalid(false);
    onCommit(next);
    setOpen(false);
  };
  const commit = () => {
    if (draft == null) return;
    const next = draft.trim() ? fromText(draft) : null;
    if (draft.trim() && next == null) setInvalid(true);
    else select(next);
  };

  return (
    <Field label={label} hideLabel={hideLabel} description={description} optionalLabel={optionalLabel} required={required} disabled={disabled} error={error ?? (invalid ? invalidMessage : undefined)} className={cx('cs-date-picker', className)}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Input
          ref={inputRef}
          value={text}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
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
    </Field>
  );
}
