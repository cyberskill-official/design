import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

export type MenuProps = BaseMenu.Root.Props;
/** Holds the open state. Controlled (`open` + `onOpenChange`) or uncontrolled. */
export function Menu(props: MenuProps) {
  return <BaseMenu.Root {...props} />;
}

export type MenuTriggerProps = Omit<BaseMenu.Trigger.Props, 'className'> & { className?: string };
/** Opens the menu. Pass `render={<Button variant="secondary" />}` to use a design-system button. */
export function MenuTrigger({ className, ...props }: MenuTriggerProps) {
  return <BaseMenu.Trigger {...props} className={className} />;
}

export type MenuContentProps = Omit<BaseMenu.Popup.Props, 'className'> &
  Pick<BaseMenu.Positioner.Props, 'side' | 'align' | 'sideOffset'> & { className?: string };

/** The menu panel, portalled and positioned against the trigger. */
export function MenuContent({ side = 'bottom', align = 'start', sideOffset = 6, className, ...props }: MenuContentProps) {
  return (
    <ThemedPortal part={BaseMenu.Portal}>
      <BaseMenu.Positioner side={side} align={align} sideOffset={sideOffset} className="cs-menu-positioner">
        <BaseMenu.Popup {...props} className={cx('cs-menu', className)} />
      </BaseMenu.Positioner>
    </ThemedPortal>
  );
}

export type MenuItemProps = Omit<BaseMenu.Item.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** Keyboard shortcut shown at the end, e.g. "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: ReactNode;
  /** `danger` for destructive actions such as Delete. */
  tone?: 'neutral' | 'danger';
};

export function MenuItem({ icon, shortcut, tone = 'neutral', className, children, ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item {...props} data-tone={tone} className={cx('cs-menu-item', className)}>
      {icon && <span className="cs-menu-item-icon" aria-hidden="true">{icon}</span>}
      <span className="cs-menu-item-label">{children}</span>
      {shortcut && <kbd className="cs-menu-item-shortcut">{shortcut}</kbd>}
    </BaseMenu.Item>
  );
}

export type MenuCheckboxItemProps = Omit<BaseMenu.CheckboxItem.Props, 'className'> & { className?: string };
/** A menu item that toggles a setting on or off. Stays open on click. */
export function MenuCheckboxItem({ className, children, ...props }: MenuCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem {...props} className={cx('cs-menu-item', className)}>
      <span className="cs-menu-item-icon" aria-hidden="true">
        <BaseMenu.CheckboxItemIndicator className="cs-menu-item-check">
          <Check />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      <span className="cs-menu-item-label">{children}</span>
    </BaseMenu.CheckboxItem>
  );
}

export type MenuSeparatorProps = Omit<BaseMenu.Separator.Props, 'className'> & { className?: string };
export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <BaseMenu.Separator {...props} className={cx('cs-menu-separator', className)} />;
}

export type MenuGroupProps = Omit<BaseMenu.Group.Props, 'className'> & { className?: string };
/** Groups related items. Label it with `MenuGroupLabel` as its first child. */
export function MenuGroup({ className, ...props }: MenuGroupProps) {
  return <BaseMenu.Group {...props} className={cx('cs-menu-group', className)} />;
}

export type MenuGroupLabelProps = Omit<BaseMenu.GroupLabel.Props, 'className'> & { className?: string };
export function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps) {
  return <BaseMenu.GroupLabel {...props} className={cx('cs-menu-group-label', className)} />;
}
