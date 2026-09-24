import type { ReactNode } from "react";

/** Inline confirm bubble anchored to its trigger — for consequential actions
 *  that don't warrant a full Dialog. OK/Cancel labels default bilingually. */
export interface PopconfirmProps {
  trigger: ReactNode;
  title: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  /** Defaults from the registry ("OK" / "Đồng ý"). */
  okLabel?: string;
  /** Defaults from the registry ("Cancel" / "Hủy"). */
  cancelLabel?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Popconfirm: React.ForwardRefExoticComponent<
  PopconfirmProps & React.RefAttributes<HTMLElement>
>;
