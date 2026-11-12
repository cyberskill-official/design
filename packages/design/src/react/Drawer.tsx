import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { X } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

export type DrawerSide = 'right' | 'left' | 'bottom';

export type DrawerProps = Omit<BaseDrawer.Root.Props, 'swipeDirection'> & {
  /** Edge the drawer slides in from; swiping back toward it dismisses. `bottom` is a mobile bottom sheet with a grab handle. */
  side?: DrawerSide;
};
/** Holds the open state. Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`). */
export function Drawer({ side = 'right', ...props }: DrawerProps) {
  return <BaseDrawer.Root {...props} swipeDirection={side === 'bottom' ? 'down' : side} />;
}

export type DrawerTriggerProps = Omit<BaseDrawer.Trigger.Props, 'className'> & { className?: string };
/** Opens the drawer. Pass `render={<Button variant="secondary" />}` to use a design-system button. */
export function DrawerTrigger({ className, ...props }: DrawerTriggerProps) {
  return <BaseDrawer.Trigger {...props} className={className} />;
}

export type DrawerContentProps = Omit<BaseDrawer.Popup.Props, 'className' | 'title'> & {
  className?: string;
  /** Heading of the drawer, announced when it opens. */
  title: ReactNode;
  /** Short explanation under the title, announced with it. */
  description?: ReactNode;
  /** Side sheets: `sm` 320px, `md` 400px, `lg` 560px wide. Bottom sheets: at most 50%, 75% or 92% of the screen height. */
  size?: 'sm' | 'md' | 'lg';
  /** Action row pinned under the scrolling body, e.g. Cancel + Save. Put the primary action last. */
  footer?: ReactNode;
  /** Accessible name of the close (×) button. Pass a Vietnamese string in Vietnamese UIs. */
  closeLabel?: string;
};

/** The sliding panel with backdrop, title, close button, scrolling body and optional footer. Focus is trapped and restored for you. */
export function DrawerContent({ title, description, size = 'md', footer, closeLabel = 'Close', className, children, ...props }: DrawerContentProps) {
  return (
    <ThemedPortal part={BaseDrawer.Portal}>
      <BaseDrawer.Backdrop className="cs-dialog-backdrop cs-drawer-backdrop" />
      <BaseDrawer.Viewport className="cs-drawer-viewport">
        <BaseDrawer.Popup {...props} data-size={size} className={cx('cs-drawer', className)}>
          <div className="cs-drawer-handle" aria-hidden="true" />
          <div className="cs-drawer-header">
            <div className="cs-dialog-heading">
              <BaseDrawer.Title className="cs-dialog-title">{title}</BaseDrawer.Title>
              {description && <BaseDrawer.Description className="cs-dialog-description">{description}</BaseDrawer.Description>}
            </div>
            <BaseDrawer.Close className="cs-dialog-close" aria-label={closeLabel}>
              <X aria-hidden="true" />
            </BaseDrawer.Close>
          </div>
          {children != null && <BaseDrawer.Content className="cs-drawer-body">{children}</BaseDrawer.Content>}
          {footer != null && <div className="cs-drawer-footer">{footer}</div>}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </ThemedPortal>
  );
}

export type DrawerCloseProps = Omit<BaseDrawer.Close.Props, 'className'> & { className?: string };
/** Closes the drawer. Use `render={<Button variant="secondary" />}` for a Cancel button. */
export function DrawerClose({ className, ...props }: DrawerCloseProps) {
  return <BaseDrawer.Close {...props} className={className} />;
}
