import { Toast as BaseToast } from '@base-ui/react/toast';
import { X } from '@phosphor-icons/react';
import { useMemo, type ReactNode } from 'react';
import { toneIcons, type AlertTone } from './Alert';
import { Button, IconButton } from './Button';
import { ThemedPortal } from './ThemeScope';

export type ToastTone = AlertTone;

export type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  /** Sets the icon and accent color. Default `info`. */
  tone?: ToastTone;
  /** One short action, e.g. Undo. Clicking it runs `onClick` and closes the toast. */
  action?: { label: ReactNode; onClick: () => void };
  /** Milliseconds before it closes on its own; `0` keeps it open. Defaults to the provider's `timeout` (5000). Paused while hovered or focused. */
  timeout?: number;
  /** `high` announces it immediately (assertive). Keep `low` (default) for routine confirmations. */
  priority?: 'low' | 'high';
  /** Reuse an id to update a toast in place instead of stacking a new one. */
  id?: string;
};

export type ToastProviderProps = BaseToast.Provider.Props & {
  /** Accessible name of each toast's close (×) button. */
  closeLabel?: string;
  /** Accessible name of the notifications region (reached with F6). */
  viewportLabel?: string;
};

/** Wrap the app once. Renders the toast stack (bottom-right on desktop, bottom on mobile) and lets `useToast()` show toasts. */
export function ToastProvider({ children, closeLabel = 'Close', viewportLabel = 'Notifications', ...props }: ToastProviderProps) {
  return (
    <BaseToast.Provider {...props}>
      {children}
      <ThemedPortal part={BaseToast.Portal}>
        <BaseToast.Viewport className="cs-toast-viewport" aria-label={viewportLabel}>
          <ToastList closeLabel={closeLabel} />
        </BaseToast.Viewport>
      </ThemedPortal>
    </BaseToast.Provider>
  );
}

function ToastList({ closeLabel }: { closeLabel: string }) {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map(toast => {
    const tone = (toast.type ?? 'info') as ToastTone;
    const Icon = toneIcons[tone] ?? toneIcons.info;
    return (
      <BaseToast.Root key={toast.id} toast={toast} data-tone={tone} className="cs-toast">
        <BaseToast.Content className="cs-toast-content">
          <span className="cs-toast-icon" aria-hidden="true">
            <Icon />
          </span>
          <div className="cs-toast-text">
            <BaseToast.Title className="cs-toast-title" />
            <BaseToast.Description className="cs-toast-description" />
            <BaseToast.Action className="cs-toast-action" render={<Button variant="secondary" size="sm" />} />
          </div>
          <BaseToast.Close className="cs-toast-close" render={<IconButton variant="ghost" size="sm" label={closeLabel} icon={<X />} />} />
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}

/** Shows and closes toasts. Must be called inside `ToastProvider`. */
export function useToast() {
  const { add, close } = BaseToast.useToastManager();
  return useMemo(
    () => ({
      /** Shows a toast and returns its id. */
      toast({ tone = 'info', action, ...options }: ToastOptions): string {
        const id: string = add({
          ...options,
          type: tone,
          actionProps: action && { children: action.label, onClick: () => { action.onClick(); close(id); } },
        });
        return id;
      },
      /** Closes one toast by id, or all toasts when called without one. */
      dismiss: (id?: string) => close(id),
    }),
    [add, close],
  );
}
