import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { CaretDown } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

export type NavigationMenuProps = Omit<BaseNavigationMenu.Root.Props, 'className'> & { className?: string };
/**
 * Website header navigation: top-level links and triggers that open dropdown panels.
 * Renders a `<nav>`; give it an `aria-label` ("Main"). On narrow screens, hide it and put the same links in a `Drawer`.
 */
export function NavigationMenu({ className, children, ...props }: NavigationMenuProps) {
  return (
    <BaseNavigationMenu.Root {...props} className={cx('cs-navigation-menu', className)}>
      <BaseNavigationMenu.List className="cs-navigation-menu-list">{children}</BaseNavigationMenu.List>
      <ThemedPortal part={BaseNavigationMenu.Portal}>
        {/* align start: the panel opens down from its trigger instead of centering on it and hanging past the header's start edge;
            near the end edge Base UI shifts it back into view */}
        <BaseNavigationMenu.Positioner align="start" sideOffset={8} collisionPadding={16} collisionAvoidance={{ side: 'none' }} className="cs-navigation-menu-positioner">
          <BaseNavigationMenu.Popup className="cs-navigation-menu-popup">
            <BaseNavigationMenu.Viewport className="cs-navigation-menu-viewport" />
          </BaseNavigationMenu.Popup>
        </BaseNavigationMenu.Positioner>
      </ThemedPortal>
    </BaseNavigationMenu.Root>
  );
}

export type NavigationMenuItemProps = Omit<BaseNavigationMenu.Item.Props, 'className'> & { className?: string };
/** One entry in the bar: a `NavigationMenuLink`, or a `NavigationMenuTrigger` with its `NavigationMenuContent`. */
export function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  return <BaseNavigationMenu.Item {...props} className={cx('cs-navigation-menu-item', className)} />;
}

export type NavigationMenuTriggerProps = Omit<BaseNavigationMenu.Trigger.Props, 'className'> & { className?: string };
/** Opens the item's panel on hover, click, Enter or ArrowDown. */
export function NavigationMenuTrigger({ className, children, ...props }: NavigationMenuTriggerProps) {
  return (
    <BaseNavigationMenu.Trigger {...props} className={cx('cs-navigation-menu-trigger', className)}>
      {children}
      <BaseNavigationMenu.Icon className="cs-navigation-menu-icon">
        <CaretDown aria-hidden="true" />
      </BaseNavigationMenu.Icon>
    </BaseNavigationMenu.Trigger>
  );
}

export type NavigationMenuContentProps = Omit<BaseNavigationMenu.Content.Props, 'className'> & {
  className?: string;
  /** Columns of link cards on wide screens; always one column on phones. */
  columns?: 1 | 2 | 3;
};
/** The dropdown panel of an item, laid out as a grid of `NavigationMenuLinkCard`s. */
export function NavigationMenuContent({ columns = 2, className, ...props }: NavigationMenuContentProps) {
  return <BaseNavigationMenu.Content {...props} data-columns={columns} className={cx('cs-navigation-menu-content', className)} />;
}

export type NavigationMenuLinkProps = Omit<BaseNavigationMenu.Link.Props, 'className'> & { className?: string };
/**
 * A top-level link in the bar. `active` marks the current page (`aria-current="page"`).
 * For client-side routing pass `render={<NextLink href="/pricing" />}`.
 */
export function NavigationMenuLink({ className, ...props }: NavigationMenuLinkProps) {
  return <BaseNavigationMenu.Link {...props} className={cx('cs-navigation-menu-trigger', className)} />;
}

export type NavigationMenuLinkCardProps = Omit<BaseNavigationMenu.Link.Props, 'className' | 'title'> & {
  className?: string;
  /** Destination name, e.g. "Agents". */
  title: ReactNode;
  /** One line on what is there. */
  description?: ReactNode;
  /** Decorative icon in a tile before the text. */
  icon?: ReactNode;
};
/** A link inside a panel with a title, description and icon. `active` marks the current page. */
export function NavigationMenuLinkCard({ title, description, icon, className, ...props }: NavigationMenuLinkCardProps) {
  return (
    <BaseNavigationMenu.Link {...props} className={cx('cs-navigation-menu-card', className)}>
      {icon && <span className="cs-navigation-menu-card-icon" aria-hidden="true">{icon}</span>}
      <span className="cs-navigation-menu-card-title">{title}</span>
      {description && <span className="cs-navigation-menu-card-description">{description}</span>}
    </BaseNavigationMenu.Link>
  );
}
