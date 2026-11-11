// Client-side helpers for the pickers (React state, react-day-picker matching). Kept out of utils.ts so that stays server-safe.
import { useState } from 'react';
import { dateMatchModifiers, type Matcher } from 'react-day-picker';

/** Day-level check that a typed date may be picked: inside min/max and not matched by `disabled`. */
export function isPickable(date: Date, min?: Date, max?: Date, disabled?: Matcher | Matcher[]): boolean {
  return !dateMatchModifiers(date, [disabled ?? false, min ? { before: min } : false, max ? { after: max } : false].flat());
}

/**
 * Controlled (`value` defined, `null` included) or uncontrolled (`defaultValue`) state, Base UI style. Once controlled,
 * a later `undefined` (React Hook Form's `reset()` without defaultValues) means empty, not the last value kept inside.
 */
export function useControllable<T>(value: T | null | undefined, defaultValue: T | null, onChange?: (value: T | null) => void) {
  const [inner, setInner] = useState(defaultValue);
  const [controlled, setControlled] = useState(value !== undefined);
  if (value !== undefined && !controlled) setControlled(true);
  const current = value !== undefined ? value : controlled ? null : inner;
  const set = (next: T | null) => {
    setInner(next);
    if (!Object.is(next, current)) onChange?.(next);
  };
  return [current, set] as const;
}

/**
 * Typed text waiting for blur or Enter, and whether it failed to parse. Both reset when the shown value changes from
 * outside (a parent or a form reset), except to empty while invalid: that is the field's own invalid commit, whose text stays.
 */
export function useDraft(shown: string) {
  const [draft, setDraft] = useState<string | null>(null); // null: show the formatted value
  const [invalid, setInvalid] = useState(false);
  const [prevShown, setPrevShown] = useState(shown);
  if (shown !== prevShown) {
    setPrevShown(shown);
    if (shown || !invalid) {
      setDraft(null);
      setInvalid(false);
    }
  }
  return { draft, setDraft, invalid, setInvalid };
}
