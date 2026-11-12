import clsx, { type ClassValue } from 'clsx';

/** Join class names. `cx('cs-button', className)` */
export function cx(...values: ClassValue[]): string {
  return clsx(values);
}
