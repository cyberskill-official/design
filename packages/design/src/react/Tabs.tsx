import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cx } from '../utils/cx';

export type TabsProps = Omit<BaseTabs.Root.Props, 'className'> & { className?: string };
/** Switches between views of the same object. Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`). */
export function Tabs({ className, ...props }: TabsProps) {
  return <BaseTabs.Root {...props} className={cx('cs-tabs', className)} />;
}

export type TabsListProps = Omit<BaseTabs.List.Props, 'className'> & { className?: string };
/** The row of tabs, with the primary-colored underline that follows the active tab. */
export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <BaseTabs.List {...props} className={cx('cs-tabs-list', className)}>
      {children}
      <BaseTabs.Indicator className="cs-tabs-indicator" />
    </BaseTabs.List>
  );
}

export type TabsTabProps = Omit<BaseTabs.Tab.Props, 'className'> & { className?: string };
export function TabsTab({ className, ...props }: TabsTabProps) {
  return <BaseTabs.Tab {...props} className={cx('cs-tabs-tab', className)} />;
}

export type TabsPanelProps = Omit<BaseTabs.Panel.Props, 'className'> & { className?: string };
export function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <BaseTabs.Panel {...props} className={cx('cs-tabs-panel', className)} />;
}
