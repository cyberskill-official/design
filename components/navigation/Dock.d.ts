import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Icon dock with hover magnification (labels via aria/title; active dot). */
export interface DockItem { icon: ReactNode; label: string; onSelect?: () => void; active?: boolean; }
export interface DockProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-label">; items: DockItem[]; label?: string; className?: string; }
export const Dock: React.ForwardRefExoticComponent<React.PropsWithoutRef<DockProps> & React.RefAttributes<HTMLDivElement>>;
