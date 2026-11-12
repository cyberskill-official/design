import { Popover as BasePopover } from '@base-ui/react/popover';
import { X } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

export type PopoverProps = BasePopover.Root.Props;
/** Holds the open state. Controlled (`open` + `onOpenChange`) or uncontrolled. */
export function Popover(props: PopoverProps) {
  return <BasePopover.Root {...props} />;
}

export type PopoverTriggerProps = Omit<BasePopover.Trigger.Props, 'className'> & { className?: string };
/** Opens the popover. Pass `render={<Button variant="secondary" />}` to use a design-system button. */
export function PopoverTrigger({ className, ...props }: PopoverTriggerProps) {
  return <BasePopover.Trigger {...props} className={className} />;
}

export type PopoverContentProps = Omit<BasePopover.Popup.Props, 'className' | 'title'> &
  Pick<BasePopover.Positioner.Props, 'side' | 'align'> & {
    className?: string;
    /** Heading that names the popover, announced when it opens. */
    title: ReactNode;
    /** Short explanation under the title, announced with it. */
    description?: ReactNode;
    /** Accessible name of the close (×) button. Pass a Vietnamese string in Vietnamese UIs. */
    closeLabel?: string;
  };

/** A non-modal panel anchored to its trigger, for short details or a small form. Escape and outside clicks close it. */
export function PopoverContent({ title, description, closeLabel = 'Close', side = 'bottom', align = 'center', className, children, ...props }: PopoverContentProps) {
  return (
    <ThemedPortal part={BasePopover.Portal}>
      <BasePopover.Positioner side={side} align={align} sideOffset={8} className="cs-popover-positioner">
        <BasePopover.Popup {...props} className={cx('cs-popover', className)}>
          <div className="cs-popover-header">
            <BasePopover.Title className="cs-popover-title">{title}</BasePopover.Title>
            <BasePopover.Close className="cs-popover-close" aria-label={closeLabel}>
              <X aria-hidden="true" />
            </BasePopover.Close>
          </div>
          {description && <BasePopover.Description className="cs-popover-description">{description}</BasePopover.Description>}
          {children != null && <div className="cs-popover-body">{children}</div>}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </ThemedPortal>
  );
}
