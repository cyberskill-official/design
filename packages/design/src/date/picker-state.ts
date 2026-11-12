// Client-side helpers for the pickers (React state, react-day-picker matching). Kept out of utils.ts so that stays server-safe.
import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';
import { dateMatchModifiers, type Matcher } from 'react-day-picker';
import { useControllableState } from '../utils/use-controllable';

/** Day-level check that a typed date may be picked: inside min/max and not matched by `disabled`. */
export function isPickable(date: Date, min?: Date, max?: Date, disabled?: Matcher | Matcher[]): boolean {
  return !dateMatchModifiers(date, [disabled ?? false, min ? { before: min } : false, max ? { after: max } : false].flat());
}

/**
 * Controlled (`value` defined, `null` included) or uncontrolled (`defaultValue`) state, Base UI style. Once controlled,
 * a later `undefined` (React Hook Form's `reset()` without defaultValues) means empty, not the last value kept inside.
 * `resets` counts outside resets: `value` turning `undefined`, or `null` without this field having just sent `null`.
 */
export function useControllable<T>(value: T | null | undefined, defaultValue: T | null, onChange?: (value: T | null) => void) {
  const [current, setInner] = useControllableState<T | null>(value, defaultValue, null);
  const [prev, setPrev] = useState(value);
  const [sentNull, setSentNull] = useState(false);
  const [resets, setResets] = useState(0);
  if (!Object.is(value, prev)) {
    setPrev(value);
    setSentNull(false);
    if (value === undefined || (value === null && !sentNull)) setResets(n => n + 1);
  }
  const set = (next: T | null) => {
    setInner(next);
    if (!Object.is(next, current)) {
      setSentNull(next === null);
      onChange?.(next);
    }
  };
  return [current, set, resets] as const;
}

/** Runs `onReset` when the form around `ref` is reset (a reset button, `form.reset()`). `onReset` may only call state setters. */
export function useFormReset(ref: RefObject<Element | null>, onReset: () => void) {
  useEffect(() => {
    const form = ref.current?.closest('form');
    form?.addEventListener('reset', onReset);
    return () => form?.removeEventListener('reset', onReset);
  }, [ref]); // not onReset: it only calls stable setters
}

/**
 * Typed text waiting for blur or Enter, and whether it failed to parse. Both reset when the shown value changes from
 * outside (a parent), except to empty while invalid: that is the field's own invalid commit, whose text stays. Both also
 * reset on an outside reset (`resets` from useControllable) and when the form around `ref` is reset.
 */
export function useDraft(shown: string, resets: number, ref: RefObject<Element | null>) {
  const [draft, setDraft] = useState<string | null>(null); // null: show the formatted value
  const [invalid, setInvalid] = useState(false);
  const [prev, setPrev] = useState({ shown, resets });
  if (shown !== prev.shown || resets !== prev.resets) {
    setPrev({ shown, resets });
    if (shown || !invalid || resets !== prev.resets) {
      setDraft(null);
      setInvalid(false);
    }
  }
  useFormReset(ref, () => {
    setDraft(null);
    setInvalid(false);
  });
  return { draft, setDraft, invalid, setInvalid };
}

// false on the server and while hydrating, true after (and straight away in client-only renders), like Calendar's today.
const noSubscribe = () => () => {};
/**
 * Whether the page has hydrated. Text formatted from a `Date` waits for it: the server's time zone may differ from the
 * visitor's, and react-dom keeps the server's input value after hydration.
 */
export const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);
