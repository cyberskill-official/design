/** The actions slots preserve numeric zero; null/false/empty string omit those slots. */
import type { ReactNode } from "react";
import type * as React from "react";

/**
 * Modal dialog: dimmed overlay + centred panel, aria-modal and labelled by its
 * title. Overlay click calls onClose. Put Buttons in `actions`. On narrow
 * viewports it goes near-fullscreen; actions grow and wrap as space permits.
 * Coarse pointers use a fade entrance to preserve touch-target dimensions.
 */
export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  title: ReactNode;
  children?: ReactNode;
  /** Footer actions, typically Buttons. */
  actions?: ReactNode;
  /** Called with `false` when the dialog asks to close. Preferred open-state callback. */
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Still supported. Called after `onOpenChange(false)` when the dialog closes. */
  onClose?: () => void;
  closeLabel?: string;
  /** Override the body description with a short description ID; an empty string opts out for structured content. */
  "aria-describedby"?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export const Dialog: React.ForwardRefExoticComponent<React.PropsWithoutRef<DialogProps> & React.RefAttributes<HTMLElement>>;
