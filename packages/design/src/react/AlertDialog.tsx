import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Warning } from '@phosphor-icons/react';
import { createContext, useContext, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Button } from './Button';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

type AlertDialogContextValue = {
  pending: boolean;
  setPending: (pending: boolean) => void;
  actionsRef: RefObject<BaseAlertDialog.Root.Actions | null>;
};
const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

export type AlertDialogProps = BaseAlertDialog.Root.Props;
/**
 * Holds the open state. Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
 * Unlike Dialog, a backdrop click does not close it, and Escape is ignored while an async `onConfirm` runs.
 */
export function AlertDialog({ onOpenChange, actionsRef, ...props }: AlertDialogProps) {
  const [pending, setPending] = useState(false);
  const ownActionsRef = useRef<BaseAlertDialog.Root.Actions>(null);
  const actions = actionsRef ?? ownActionsRef;
  return (
    <AlertDialogContext.Provider value={{ pending, setPending, actionsRef: actions }}>
      <BaseAlertDialog.Root
        {...props}
        actionsRef={actions}
        onOpenChange={(open, details) => {
          if (pending && !open && details.reason !== 'imperative-action') return details.cancel();
          onOpenChange?.(open, details);
        }}
      />
    </AlertDialogContext.Provider>
  );
}

export type AlertDialogTriggerProps = Omit<BaseAlertDialog.Trigger.Props, 'className'> & { className?: string };
/** Opens the alert dialog. Pass `render={<Button variant="danger" />}` to use a design-system button. */
export function AlertDialogTrigger({ className, ...props }: AlertDialogTriggerProps) {
  return <BaseAlertDialog.Trigger {...props} className={className} />;
}

export type AlertDialogContentProps = Omit<BaseAlertDialog.Popup.Props, 'className' | 'title'> & {
  className?: string;
  /** The question, announced when it opens: "Delete Support Copilot?". */
  title: ReactNode;
  /** What happens if the user confirms, announced with the title. */
  description?: ReactNode;
  /** `danger` (default) shows a warning icon and a red confirm button; `neutral` a primary one. */
  tone?: 'danger' | 'neutral';
  /** Label of the button that dismisses. Pass a Vietnamese string in Vietnamese UIs. */
  cancelLabel?: string;
  /** Label of the confirm button. Name the action ("Delete agent"), not "OK". */
  confirmLabel?: string;
  /**
   * Runs on confirm. Return a promise to keep the dialog open with a loading button until it settles:
   * it closes when the promise resolves and stays open when it rejects (show the error yourself).
   */
  onConfirm?: () => void | Promise<unknown>;
};

/** The confirmation panel: title, description, Cancel and a confirm action. Focus starts on Cancel. */
export function AlertDialogContent({ title, description, tone = 'danger', cancelLabel = 'Cancel', confirmLabel = 'Confirm', onConfirm, className, children, ...props }: AlertDialogContentProps) {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error('AlertDialogContent must be used inside AlertDialog.');
  const { pending, setPending, actionsRef } = ctx;

  async function confirm() {
    const result = onConfirm?.();
    if (!(result instanceof Promise)) return actionsRef.current?.close();
    setPending(true);
    try {
      await result;
      actionsRef.current?.close();
    } catch {
      // Rejected: stay open so the user can retry or cancel; the caller reports the error.
    } finally {
      setPending(false);
    }
  }

  return (
    <ThemedPortal part={BaseAlertDialog.Portal}>
      <BaseAlertDialog.Backdrop className="cs-dialog-backdrop" />
      <BaseAlertDialog.Popup {...props} data-size="sm" data-tone={tone} className={cx('cs-dialog', 'cs-alert-dialog', className)}>
        <div className="cs-dialog-header">
          {tone === 'danger' && (
            <span className="cs-dialog-icon" data-tone="danger" aria-hidden="true">
              <Warning />
            </span>
          )}
          <div className="cs-dialog-heading">
            <BaseAlertDialog.Title className="cs-dialog-title">{title}</BaseAlertDialog.Title>
            {description && <BaseAlertDialog.Description className="cs-dialog-description">{description}</BaseAlertDialog.Description>}
          </div>
        </div>
        {children != null && <div className="cs-dialog-body">{children}</div>}
        <div className="cs-dialog-footer">
          <BaseAlertDialog.Close render={<Button variant="secondary" />} disabled={pending}>
            {cancelLabel}
          </BaseAlertDialog.Close>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={pending} onClick={confirm}>
            {confirmLabel}
          </Button>
        </div>
      </BaseAlertDialog.Popup>
    </ThemedPortal>
  );
}
