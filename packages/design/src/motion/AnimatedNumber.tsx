import { animate } from 'motion/react';
import { useLayoutEffect, useRef, type ComponentProps } from 'react';
import { cx } from '../utils/cx';
import { useReducedMotionCheck } from './MotionProvider';
import { transitions } from './tokens';

export type AnimatedNumberProps = Omit<ComponentProps<'span'>, 'children'> & {
  value: number;
  /**
   * Count up from this number when it mounts. The first render (server HTML included) shows `from` in the visible
   * digits and `value` to screen readers, so hydration does not jump; without JavaScript the visible digits stay at `from`.
   */
  from?: number;
  /** Locale for `Intl.NumberFormat`, e.g. `'vi-VN'`. Defaults to the browser's. */
  locale?: Intl.LocalesArgument;
  /** `Intl.NumberFormat` options: currency, percent, compact notation, fraction digits. */
  format?: Intl.NumberFormatOptions;
};

/**
 * A number that counts from its previous value to a new `value` with an ease-out (the `reveal` recipe). It renders
 * `value` as is and counts only when it changes, or on mount with `from`. Screen readers get the final value only,
 * never the ticking digits. With reduced motion it shows the final value at once. Digits are tabular, so the width holds.
 */
export function AnimatedNumber({ value, from, locale, format, className, style, ...props }: AnimatedNumberProps) {
  const formatter = new Intl.NumberFormat(locale, format);
  const text = formatter.format(value);
  const digits = useRef<HTMLSpanElement>(null);
  const shown = useRef(from ?? value); // the number on screen; a count starts from it
  const mounted = useRef(false);
  const reduced = useReducedMotionCheck();
  useLayoutEffect(() => {
    mounted.current = true;
    const el = digits.current;
    if (!el) return;
    const places = String(value).split('.')[1]?.length ?? 0; // frames keep the final value's precision ("523", not "523.457")
    const paint = (n: number) => { shown.current = n; el.textContent = formatter.format(+n.toFixed(places) || 0); }; // || 0: never "-0"
    if (reduced()) return paint(value);
    if (shown.current === value) return;
    paint(shown.current); // React has just written the final value; show where the count is before the first paint
    const controls = animate(shown.current, value, { ...transitions.reveal, onUpdate: paint });
    return () => controls.stop();
  }, [value]); // a new locale or format alone needs no count: React re-renders the final text
  return (
    <span {...props} className={cx('cs-animated-number', className)} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      <span ref={digits} aria-hidden="true">{!mounted.current && from !== undefined ? formatter.format(from) : text}</span>
      <span className="cs-visually-hidden">{text}</span>
    </span>
  );
}
