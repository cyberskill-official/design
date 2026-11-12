import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

export type ContextMenuProps = BaseContextMenu.Root.Props;
/** Holds the open state. Controlled (`open` + `onOpenChange`) or uncontrolled. */
export function ContextMenu(props: ContextMenuProps) {
  return <BaseContextMenu.Root {...props} />;
}

export type ContextMenuTriggerProps = Omit<BaseContextMenu.Trigger.Props, 'className'> & { className?: string };
/**
 * The area that opens the menu on right click or long press (a card, a row, a canvas).
 * Keyboard and screen reader users can't open it, so offer the same actions in a visible menu button too.
 */
export function ContextMenuTrigger({ className, ...props }: ContextMenuTriggerProps) {
  return <BaseContextMenu.Trigger {...props} className={cx('cs-context-menu-trigger', className)} />;
}

export type ContextMenuContentProps = Omit<BaseContextMenu.Popup.Props, 'className'> & { className?: string };
/** The menu panel, portalled and opened at the pointer. */
export function ContextMenuContent({ className, ...props }: ContextMenuContentProps) {
  return (
    <ThemedPortal part={BaseContextMenu.Portal}>
      <BaseContextMenu.Positioner className="cs-context-menu-positioner">
        <BaseContextMenu.Popup {...props} className={cx('cs-context-menu', className)} />
      </BaseContextMenu.Positioner>
    </ThemedPortal>
  );
}

export type ContextMenuItemProps = Omit<BaseContextMenu.Item.Props, 'className'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** Keyboard shortcut shown at the end, e.g. "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: ReactNode;
  /** `danger` for destructive actions such as Delete. */
  tone?: 'neutral' | 'danger';
};

export function ContextMenuItem({ icon, shortcut, tone = 'neutral', className, children, ...props }: ContextMenuItemProps) {
  return (
    <BaseContextMenu.Item {...props} data-tone={tone} className={cx('cs-context-menu-item', className)}>
      {icon && <span className="cs-context-menu-item-icon" aria-hidden="true">{icon}</span>}
      <span className="cs-context-menu-item-label">{children}</span>
      {shortcut && <kbd className="cs-context-menu-item-shortcut">{shortcut}</kbd>}
    </BaseContextMenu.Item>
  );
}

export type ContextMenuSeparatorProps = Omit<BaseContextMenu.Separator.Props, 'className'> & { className?: string };
export function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
  return <BaseContextMenu.Separator {...props} className={cx('cs-context-menu-separator', className)} />;
}
