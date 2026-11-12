import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

export type DialogProps = BaseDialog.Root.Props;
/** Holds the open state. Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`). */
export function Dialog(props: DialogProps) {
  return <BaseDialog.Root {...props} />;
}

export type DialogTriggerProps = Omit<BaseDialog.Trigger.Props, 'className'> & { className?: string };
/** Opens the dialog. Pass `render={<Button variant="secondary" />}` to use a design-system button. */
export function DialogTrigger({ className, ...props }: DialogTriggerProps) {
  return <BaseDialog.Trigger {...props} className={className} />;
}

export type DialogContentProps = Omit<BaseDialog.Popup.Props, 'className' | 'title'> & {
  className?: string;
  /** Heading of the dialog, announced when it opens. */
  title: ReactNode;
  /** Short explanation under the title, announced with it. */
  description?: ReactNode;
  /** `sm` 400px (confirmations), `md` 520px (forms), `lg` 720px (rich content). */
  size?: 'sm' | 'md' | 'lg';
  /** Icon badge beside the title; `tone` tints it. */
  icon?: ReactNode;
  tone?: 'neutral' | 'danger' | 'accent';
  /** Accessible name of the close (×) button. Pass a Vietnamese string in Vietnamese UIs. */
  closeLabel?: string;
  hideClose?: boolean;
};

/** The dialog panel with backdrop, title, description and close button. Focus is trapped and restored for you. */
export function DialogContent({ title, description, size = 'md', icon, tone = 'neutral', closeLabel = 'Close', hideClose, className, children, ...props }: DialogContentProps) {
  return (
    <ThemedPortal part={BaseDialog.Portal}>
      <BaseDialog.Backdrop className="cs-dialog-backdrop" />
      <BaseDialog.Popup {...props} data-size={size} className={cx('cs-dialog', className)}>
        <div className="cs-dialog-header">
          {icon && <span className="cs-dialog-icon" data-tone={tone} aria-hidden="true">{icon}</span>}
          <div className="cs-dialog-heading">
            <BaseDialog.Title className="cs-dialog-title">{title}</BaseDialog.Title>
            {description && <BaseDialog.Description className="cs-dialog-description">{description}</BaseDialog.Description>}
          </div>
          {!hideClose && (
            <BaseDialog.Close className="cs-dialog-close" aria-label={closeLabel}>
              <X aria-hidden="true" />
            </BaseDialog.Close>
          )}
        </div>
        {children != null && <div className="cs-dialog-body">{children}</div>}
      </BaseDialog.Popup>
    </ThemedPortal>
  );
}

/** Right-aligned action row at the bottom of a dialog. Put the primary action last. */
export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('cs-dialog-footer', className)} />;
}

export type DialogCloseProps = Omit<BaseDialog.Close.Props, 'className'> & { className?: string };
/** Closes the dialog. Use `render={<Button variant="secondary" />}` for a Cancel button. */
export function DialogClose({ className, ...props }: DialogCloseProps) {
  return <BaseDialog.Close {...props} className={className} />;
}
