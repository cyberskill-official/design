import { CheckCircle, Info, Warning, X, XCircle } from '@phosphor-icons/react';
import type { HTMLAttributes, ReactNode } from 'react';
import { IconButton } from './Button';
import { cx } from '../utils/cx';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

/** Phosphor icon per status tone. Shared with Toast so both read the same. */
export const toneIcons = { info: Info, success: CheckCircle, warning: Warning, danger: XCircle } as const;

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  className?: string;
  tone?: AlertTone;
  /** Short headline, e.g. "Payment failed". */
  title: ReactNode;
  description?: ReactNode;
  /** Actions under the text, e.g. a small Button or a link. */
  action?: ReactNode;
  /** Shows a dismiss (×) button that calls this. */
  onDismiss?: () => void;
  /** Accessible name of the dismiss button. Pass a Vietnamese string in Vietnamese UIs. */
  dismissLabel?: string;
};

/**
 * Inline message about the page or a section. Always shows the tone's icon and text, never color alone.
 * Live role follows the tone: `status` (polite) for info/success, `alert` (interrupts) for warning/danger.
 * Pass `role="note"` for a message that is on the page from the start and should not be announced.
 */
export function Alert({ tone = 'info', title, description, action, onDismiss, dismissLabel = 'Dismiss', className, ...props }: AlertProps) {
  const Icon = toneIcons[tone];
  return (
    <div role={tone === 'warning' || tone === 'danger' ? 'alert' : 'status'} {...props} data-tone={tone} className={cx('cs-alert', className)}>
      <span className="cs-alert-icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="cs-alert-content">
        <div className="cs-alert-title">{title}</div>
        {description != null && <div className="cs-alert-description">{description}</div>}
        {action != null && <div className="cs-alert-actions">{action}</div>}
      </div>
      {onDismiss && <IconButton className="cs-alert-dismiss" variant="ghost" size="sm" label={dismissLabel} icon={<X />} onClick={onDismiss} />}
    </div>
  );
}
