import { Menu as BaseMenu } from '@base-ui/react/menu';
import { CaretRight, Check } from '@phosphor-icons/react';
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

// 6px under the trigger; a submenu beside its trigger overlaps the parent's padding so the items line up.
const isBelowOrAbove = ({ side }: { side: string }) => side === 'bottom' || side === 'top';
const defaultSideOffset = (data: { side: string }) => (isBelowOrAbove(data) ? 6 : -4);
const defaultAlignOffset = (data: { side: string }) => (isBelowOrAbove(data) ? 0 : -4);

/** The menu panel, portalled and positioned against the trigger. Opens below a `MenuTrigger` and beside a `MenuSubmenuTrigger`. */
export function MenuContent({ side, align = 'start', sideOffset = defaultSideOffset, className, ...props }: MenuContentProps) {
  return (
    <ThemedPortal part={BaseMenu.Portal}>
      <BaseMenu.Positioner side={side} align={align} sideOffset={sideOffset} alignOffset={defaultAlignOffset} className="cs-menu-positioner">
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

export type MenuRadioGroupProps = Omit<BaseMenu.RadioGroup.Props, 'className'> & { className?: string };
/** One choice among `MenuRadioItem`s, e.g. sort order. `value` / `defaultValue` / `onValueChange`. */
export function MenuRadioGroup({ className, ...props }: MenuRadioGroupProps) {
  return <BaseMenu.RadioGroup {...props} className={cx('cs-menu-group', className)} />;
}

export type MenuRadioItemProps = Omit<BaseMenu.RadioItem.Props, 'className'> & { className?: string };
/** A menu item that picks one value in its `MenuRadioGroup`, marked with a check. Stays open on click. */
export function MenuRadioItem({ className, children, ...props }: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem {...props} className={cx('cs-menu-item', className)}>
      <span className="cs-menu-item-icon" aria-hidden="true">
        <BaseMenu.RadioItemIndicator className="cs-menu-item-check">
          <Check />
        </BaseMenu.RadioItemIndicator>
      </span>
      <span className="cs-menu-item-label">{children}</span>
    </BaseMenu.RadioItem>
  );
}

export type MenuLinkItemProps = Omit<BaseMenu.LinkItem.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
};
/** A menu item that navigates. Pass `href`, or `render={<Link href="/settings" />}` for a router link. Closes the menu on click. */
export function MenuLinkItem({ icon, closeOnClick = true, className, children, ...props }: MenuLinkItemProps) {
  return (
    <BaseMenu.LinkItem {...props} closeOnClick={closeOnClick} className={cx('cs-menu-item', className)}>
      {icon && <span className="cs-menu-item-icon" aria-hidden="true">{icon}</span>}
      <span className="cs-menu-item-label">{children}</span>
    </BaseMenu.LinkItem>
  );
}

export type MenuSubmenuProps = BaseMenu.SubmenuRoot.Props;
/** A nested menu: a `MenuSubmenuTrigger` and its own `MenuContent`, which opens to the side. Opens on hover, ArrowRight or Enter. */
export function MenuSubmenu(props: MenuSubmenuProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

export type MenuSubmenuTriggerProps = Omit<BaseMenu.SubmenuTrigger.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
};
/** The item that opens a `MenuSubmenu`, with a caret pointing where it opens. */
export function MenuSubmenuTrigger({ icon, className, children, ...props }: MenuSubmenuTriggerProps) {
  return (
    <BaseMenu.SubmenuTrigger {...props} className={cx('cs-menu-item', className)}>
      {icon && <span className="cs-menu-item-icon" aria-hidden="true">{icon}</span>}
      <span className="cs-menu-item-label">{children}</span>
      <CaretRight className="cs-menu-submenu-caret" aria-hidden="true" />
    </BaseMenu.SubmenuTrigger>
  );
}
