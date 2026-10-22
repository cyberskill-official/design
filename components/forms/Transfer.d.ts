import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Two-list mover: check items, ‹/› them across. value = keys in the target list. */
export interface TransferItem { key: string; label: ReactNode; }
export interface TransferProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  items: TransferItem[];
  /** Caller-controlled target keys. Internal checkbox selection drops removed items. */
  value?: string[];
  onChange?: (targetKeys: string[]) => void;
  /** [sourceTitle, targetTitle]; bilingual defaults from the registry. */
  titles?: [ReactNode, ReactNode];
  lang?: string;
  className?: string;
}
export const Transfer: React.ForwardRefExoticComponent<React.PropsWithoutRef<TransferProps> & React.RefAttributes<HTMLDivElement>>;
