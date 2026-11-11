import { cx } from '../utils/cx';

export type KbdProps = React.HTMLAttributes<HTMLElement> & { className?: string };

/** One keyboard key, e.g. `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. Adjacent keys space themselves. */
export function Kbd({ className, ...props }: KbdProps) {
  return <kbd {...props} className={cx('cs-kbd', className)} />;
}
