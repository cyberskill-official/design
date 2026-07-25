import type { ReactNode } from "react";

/**
 * First-class confirm / destructive modal — role="alertdialog", focus trap + restore.
 * Distinct from Popconfirm (inline bubble) and Dialog (general modal).
 */
export interface AlertDialogProps {
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
  /** `destructive` styles the confirm action as danger. Alias: `variant`. */
  tone?: "default" | "destructive";
  variant?: "default" | "destructive";
  onConfirm?: () => void;
  onCancel?: () => void;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export function AlertDialog(props: AlertDialogProps): React.ReactElement | null;
