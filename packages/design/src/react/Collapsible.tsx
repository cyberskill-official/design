import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { CaretRight } from '@phosphor-icons/react';
import { cx } from '../utils/cx';

export type CollapsibleProps = Omit<BaseCollapsible.Root.Props, 'className'> & { className?: string };
/** Shows and hides one region. Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`). */
export function Collapsible({ className, ...props }: CollapsibleProps) {
  return <BaseCollapsible.Root {...props} className={cx('cs-collapsible', className)} />;
}

export type CollapsibleTriggerProps = Omit<BaseCollapsible.Trigger.Props, 'className'> & { className?: string };
/** The button that toggles the panel, with a caret that turns when open. */
export function CollapsibleTrigger({ className, children, ...props }: CollapsibleTriggerProps) {
  return (
    <BaseCollapsible.Trigger {...props} className={cx('cs-collapsible-trigger', className)}>
      <CaretRight className="cs-collapsible-icon" aria-hidden="true" />
      {children}
    </BaseCollapsible.Trigger>
  );
}

export type CollapsiblePanelProps = Omit<BaseCollapsible.Panel.Props, 'className'> & { className?: string };
/** The region that opens and closes. Its height animates. */
export function CollapsiblePanel({ className, ...props }: CollapsiblePanelProps) {
  return <BaseCollapsible.Panel {...props} className={cx('cs-collapsible-panel', className)} />;
}
