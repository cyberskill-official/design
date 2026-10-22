import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Inline confirm bubble anchored to its trigger — for consequential actions
 *  that don't warrant a full Dialog. OK/Cancel labels default bilingually. */
export interface PopconfirmProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing span root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLSpanElement>;
  trigger: ReactNode;
  title: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  /** Defaults from the registry ("Confirm" / "Xác nhận"). */
  okLabel?: string;
  /** Defaults from the registry ("Cancel" / "Hủy"). */
  cancelLabel?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Popconfirm: React.ForwardRefExoticComponent<React.PropsWithoutRef<PopconfirmProps> & React.RefAttributes<HTMLSpanElement>>;
