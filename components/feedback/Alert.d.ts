import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Inline banner for contextual messages. Semantic variant sets the accent
 * border + default icon; pass `icon` to override. Meaning is carried by the
 * title/body text, never colour alone.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  /** Called with `false` when the dismiss button is used. Preferred open-state callback. */
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Still supported. Called after `onOpenChange(false)` when the banner is dismissed. */
  onClose?: () => void;
  /** @deprecated Still supported. Click handler called after `onOpenChange(false)` and `onClose`. Shows the dismiss button. */
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
}

export const Alert: React.ForwardRefExoticComponent<React.PropsWithoutRef<AlertProps> & React.RefAttributes<HTMLDivElement>>;
