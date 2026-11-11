import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { CaretRight } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

// Menubar menus are Base UI Menu parts, the same ones ContextMenu uses, so they share items and styles.
export { ContextMenuItem as MenubarItem, ContextMenuSeparator as MenubarSeparator } from './ContextMenu';
export type { ContextMenuItemProps as MenubarItemProps, ContextMenuSeparatorProps as MenubarSeparatorProps } from './ContextMenu';

export type MenubarProps = Omit<BaseMenubar.Props, 'className'> & { className?: string };
/** A desktop-app style row of menus (File, Edit, View). Arrow keys move between menus and items. Give it an `aria-label`. */
export function Menubar({ className, ...props }: MenubarProps) {
  return <BaseMenubar {...props} className={cx('cs-menubar', className)} />;
}

export type MenubarMenuProps = BaseMenu.Root.Props;
/** One menu in the bar: a `MenubarTrigger` and its `MenubarContent`. */
export function MenubarMenu(props: MenubarMenuProps) {
  return <BaseMenu.Root {...props} />;
}

export type MenubarTriggerProps = Omit<BaseMenu.Trigger.Props, 'className'> & { className?: string };
export function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return <BaseMenu.Trigger {...props} className={cx('cs-menubar-trigger', className)} />;
}

type Side = 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
// Menus open 4px under the bar; submenus overlap their parent by its padding so the items line up.
const isBelowOrAbove = ({ side }: { side: Side }) => side === 'bottom' || side === 'top';
const sideOffset = (data: { side: Side }) => (isBelowOrAbove(data) ? 4 : -4);
const alignOffset = (data: { side: Side }) => (isBelowOrAbove(data) ? 0 : -4);

export type MenubarContentProps = Omit<BaseMenu.Popup.Props, 'className'> & { className?: string };
/** The menu panel for a `MenubarMenu` or a `MenubarSubmenu`, portalled and positioned for you. */
export function MenubarContent({ className, ...props }: MenubarContentProps) {
  return (
    <ThemedPortal part={BaseMenu.Portal}>
      <BaseMenu.Positioner sideOffset={sideOffset} alignOffset={alignOffset} className="cs-context-menu-positioner">
        <BaseMenu.Popup {...props} className={cx('cs-context-menu', className)} />
      </BaseMenu.Positioner>
    </ThemedPortal>
  );
}

export type MenubarSubmenuProps = BaseMenu.SubmenuRoot.Props;
/** A nested menu: a `MenubarSubmenuTrigger` and its `MenubarContent`. Opens on hover, ArrowRight or Enter. */
export function MenubarSubmenu(props: MenubarSubmenuProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

export type MenubarSubmenuTriggerProps = Omit<BaseMenu.SubmenuTrigger.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
};
export function MenubarSubmenuTrigger({ icon, className, children, ...props }: MenubarSubmenuTriggerProps) {
  return (
    <BaseMenu.SubmenuTrigger {...props} className={cx('cs-context-menu-item', className)}>
      {icon && <span className="cs-context-menu-item-icon" aria-hidden="true">{icon}</span>}
      <span className="cs-context-menu-item-label">{children}</span>
      <CaretRight className="cs-menubar-submenu-caret" aria-hidden="true" />
    </BaseMenu.SubmenuTrigger>
  );
}
