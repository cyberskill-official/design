import type { ReactNode } from "react";

/** Two-list mover: check items, ‹/› them across. value = keys in the target list. */
export interface TransferItem { key: string; label: ReactNode; }
export interface TransferProps {
  items: TransferItem[];
  value?: string[];
  onChange?: (targetKeys: string[]) => void;
  /** [sourceTitle, targetTitle]; bilingual defaults from the registry. */
  titles?: [ReactNode, ReactNode];
  lang?: string;
  className?: string;
}
export const Transfer: React.ForwardRefExoticComponent<
  TransferProps & React.RefAttributes<HTMLElement>
>;
