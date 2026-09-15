import type { ReactNode } from "react";
import type * as React from "react";

/**
 * Modal dialog: dimmed overlay + centred panel, aria-modal and labelled by its
 * title. Overlay click calls onClose. Put Buttons in `actions`. On narrow
 * viewports it goes near-fullscreen and actions stack.
 */
export interface DialogProps {
  open: boolean;
  title: ReactNode;
  children?: ReactNode;
  /** Footer actions, typically Buttons. */
  actions?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export const Dialog: React.ForwardRefExoticComponent<
  DialogProps & React.RefAttributes<HTMLElement>
>;
