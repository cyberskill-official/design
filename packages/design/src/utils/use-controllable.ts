// A React hook, so kept out of utils/index.ts (that entry stays hook-free and safe for Server Components).
import { useState } from 'react';

/**
 * Controlled (`value` defined) or uncontrolled (`defaultValue`) state, Base UI style. Once controlled, a later `undefined`
 * (React Hook Form's `reset()` without defaultValues) means `empty`, not the last value kept inside.
 * The setter only updates the uncontrolled copy; callers still report the change.
 */
export function useControllableState<T>(value: T | undefined, defaultValue: T, empty: T) {
  const [inner, setInner] = useState(defaultValue);
  const [controlled, setControlled] = useState(value !== undefined);
  if (value !== undefined && !controlled) setControlled(true);
  const current = value !== undefined ? value : controlled ? empty : inner;
  return [current, setInner] as const;
}
