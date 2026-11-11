// Client-side helpers for the pickers (React state, react-day-picker matching). Kept out of utils.ts so that stays server-safe.
import { useState } from 'react';
import { dateMatchModifiers, type Matcher } from 'react-day-picker';

/** Day-level check that a typed date may be picked: inside min/max and not matched by `disabled`. */
export function isPickable(date: Date, min?: Date, max?: Date, disabled?: Matcher | Matcher[]): boolean {
  return !dateMatchModifiers(date, [disabled ?? false, min ? { before: min } : false, max ? { after: max } : false].flat());
}

/** Controlled (`value` defined, `null` included) or uncontrolled (`defaultValue`) state, Base UI style. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    setInner(next);
    if (!Object.is(next, current)) onChange?.(next);
  };
  return [current, set] as const;
}
