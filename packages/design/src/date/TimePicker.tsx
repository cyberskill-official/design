import { Combobox } from '@base-ui/react/combobox';
import { Check, Clock } from '@phosphor-icons/react';
import type { Locale } from 'date-fns';
import { useMemo, useRef, type FocusEventHandler, type ReactNode, type Ref } from 'react';
import { Button } from '../react/Button';
import { Field, type FieldProps } from '../react/Field';
import { cx } from '../utils/cx';
import { formatTime, parseTime } from './utils';
import { useControllable, useDraft } from './picker-state';
import { ThemedPortal } from '../react/ThemeScope';

type Slot = { value: string; label: string };

export type TimePickerProps = Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel' | 'required' | 'disabled'> & {
  className?: string;
  /** 24-hour `"HH:mm"`, whatever `hourCycle` shows. */
  value?: string | null;
  defaultValue?: string | null;
  /** Called with `"HH:mm"`, or `null` when cleared or when the typed text is not an allowed time. */
  onValueChange?: (value: string | null) => void;
  /** Minutes between suggested times. */
  step?: number;
  /** Earliest allowed time, e.g. `"09:00"` (any form `parseTime` reads, such as `"9h"`). */
  min?: string;
  /** Latest allowed time, e.g. `"17:30"`. */
  max?: string;
  /** `24` shows `21:30`, `12` shows `9:30 PM` (AM/PM words from `locale`). Typing either works. */
  hourCycle?: 12 | 24;
  locale?: Locale;
  placeholder?: string;
  /** Shown when the typed text is not a time or is outside min/max. */
  invalidMessage?: ReactNode;
  /** Submits the value with a native form (hidden input, `HH:mm`; empty while there is no valid time). */
  name?: string;
  /** Ref to the visible text input, e.g. React Hook Form's `field.ref` so a failed submit focuses it. */
  inputRef?: Ref<HTMLInputElement>;
  /** Called when the visible input loses focus, after the typed text is checked (React Hook Form's `field.onBlur`). */
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

const digits = (s: string) => s.replace(/\D/g, '');

/** Labelled time field: type `9:30`, `21:30` or `930`, or choose from a list of times every `step` minutes. */
export function TimePicker({ label, hideLabel, description, error, optionalLabel, required, disabled, className, value, defaultValue = null, onValueChange, step = 15, min, max, hourCycle = 24, locale, placeholder = hourCycle === 24 ? 'hh:mm' : 'h:mm', invalidMessage = 'Enter a valid time', name, inputRef, onBlur }: TimePickerProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const highlighted = useRef<Slot | undefined>(undefined);
  // Normalised so "9:00" and "09:00" compare the same ("HH:mm" strings sort like times).
  const lo = (min && parseTime(min)) || '00:00';
  const hi = (max && parseTime(max)) || '23:59';

  const slots = useMemo(() => {
    const [start = 0, end = 1439] = [lo, hi].map(t => { const [h = 0, m = 0] = t.split(':').map(Number); return h * 60 + m; });
    const list: Slot[] = [];
    for (let t = start; t <= end; t += Math.max(1, step)) {
      const time = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      list.push({ value: time, label: formatTime(time, hourCycle, locale) });
    }
    return list;
  }, [lo, hi, step, hourCycle, locale]);

  const shown = current ? formatTime(current, hourCycle, locale) : '';
  const { draft, setDraft, invalid, setInvalid } = useDraft(shown);
  const text = draft ?? shown;
  // A typed off-step time (09:37) stays the value even though the list has no row for it.
  const selected = current ? (slots.find(s => s.value === current) ?? { value: current, label: shown }) : null;

  const commit = (next: string | null) => {
    setDraft(null);
    setInvalid(false);
    setCurrent(next);
  };
  const commitText = () => {
    if (draft == null) return;
    const parsed = parseTime(draft);
    if (!draft.trim()) commit(null);
    else if (parsed && parsed >= lo && parsed <= hi) commit(parsed);
    else {
      setInvalid(true);
      setCurrent(null); // keep the typed text, but don't let a form submit the old time
    }
  };
  // A value can fall outside min/max when they change (DateTimePicker moves them with the date).
  const outOfRange = current != null && (current < lo || current > hi);

  return (
    <Field label={label} hideLabel={hideLabel} description={description} optionalLabel={optionalLabel} required={required} disabled={disabled} error={error ?? (invalid || outOfRange ? invalidMessage : undefined)} className={cx('cs-time-picker', className)}>
      {/* Combobox, not Autocomplete: its selected item is highlighted and scrolled into view when the list opens.
          The input text is ours (inputValue) so free typing like "9:37" works; it is parsed on blur and Enter. */}
      <Combobox.Root
        items={slots}
        value={selected}
        inputValue={text}
        disabled={disabled}
        required={required}
        name={name}
        isItemEqualToValue={(a: Slot, b: Slot) => a.value === b.value}
        itemToStringLabel={(slot: Slot) => slot.label}
        onItemHighlighted={item => { highlighted.current = item as Slot | undefined; }}
        onValueChange={(slot: Slot | null) => commit(slot?.value ?? null)}
        onInputValueChange={(next, details) => { if (details.reason === 'input-change') setDraft(next); }}
        // While typing, narrow the list by digits: "9" → 09:xx, "93" → 09:30. The committed value shows every time.
        filter={(item: Slot, query: string) => {
          const q = digits(query);
          return query === shown || !q || [item.value, item.label].some(s => digits(s).startsWith(q) || digits(s).startsWith(`0${q}`));
        }}
      >
        <Combobox.InputGroup className="cs-input-group">
          <Combobox.Input
            ref={inputRef}
            className="cs-input"
            placeholder={placeholder}
            autoComplete="off"
            onBlur={e => {
              commitText();
              onBlur?.(e);
            }}
            onKeyDown={e => { if (e.key === 'Enter' && !highlighted.current) commitText(); }}
          />
          <span className="cs-input-adornment" data-side="end">
            {/* Base UI names this button with the field label. */}
            <Combobox.Trigger render={<Button variant="ghost" size="sm" iconStart={<Clock />} data-icon-only="" className="cs-icon-button" />} />
          </span>
        </Combobox.InputGroup>
        <ThemedPortal part={Combobox.Portal}>
          <Combobox.Positioner className="cs-time-picker-positioner" align="start" sideOffset={8}>
            <Combobox.Popup className="cs-time-picker-popup">
              <Combobox.List className="cs-time-picker-list">
                {(slot: Slot) => (
                  <Combobox.Item key={slot.value} value={slot} className="cs-time-picker-item">
                    <span>{slot.label}</span>
                    <Combobox.ItemIndicator className="cs-time-picker-check">
                      <Check aria-hidden="true" />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </ThemedPortal>
      </Combobox.Root>
    </Field>
  );
}
