import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cx } from '../utils/cx';

export type ScrollAreaProps = Omit<BaseScrollArea.Root.Props, 'className'> & {
  className?: string;
  /** Accessible name of the scrollable region. Keyboard users can focus it and scroll with the arrow keys. */
  label: string;
};

/** A scrollable box with thin, theme-aware scrollbars on both axes. Size it with `className` or `style` (e.g. a `height` or `max-height`). */
export function ScrollArea({ label, className, children, ...props }: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root {...props} className={cx('cs-scroll-area', className)}>
      <BaseScrollArea.Viewport className="cs-scroll-area-viewport" role="region" aria-label={label}>
        <BaseScrollArea.Content className="cs-scroll-area-content">{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar orientation="vertical" className="cs-scroll-area-scrollbar">
        <BaseScrollArea.Thumb className="cs-scroll-area-thumb" />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Scrollbar orientation="horizontal" className="cs-scroll-area-scrollbar">
        <BaseScrollArea.Thumb className="cs-scroll-area-thumb" />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Corner className="cs-scroll-area-corner" />
    </BaseScrollArea.Root>
  );
}
