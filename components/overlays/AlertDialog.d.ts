import type * as React from "react";
import type { ReactNode } from "react";

/**
 * First-class confirm / destructive modal — role="alertdialog", focus trap + restore.
 * Distinct from Popconfirm (inline bubble) and Dialog (general modal).
 * Coarse pointers use a fade entrance to preserve touch-target dimensions.
 */
export interface AlertDialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  /** Prefer over children for the described body. */
  description?: ReactNode;
  children?: ReactNode;
  /** Defaults from the registry ("Confirm" / "Xác nhận"). */
  confirmLabel?: string;
  /** Defaults from the registry ("Cancel" / "Hủy"). */
  cancelLabel?: string;
  /** `destructive` styles the confirm action as danger and initially focuses Cancel. `tone` wins when both are supplied, including `tone="default"` with `variant="destructive"`. `variant` is a retained compatibility alias; omission of both is non-destructive. */
  tone?: "default" | "destructive";
  /** Compatibility alias used only when tone is undefined. No removal notice is in force. */
  variant?: "default" | "destructive";
  onConfirm?: () => void;
  onCancel?: () => void;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export const AlertDialog: React.ForwardRefExoticComponent<React.PropsWithoutRef<AlertDialogProps> & React.RefAttributes<HTMLElement>>;
