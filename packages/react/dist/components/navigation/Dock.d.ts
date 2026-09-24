import type { ReactNode } from "react";

/** Icon dock with hover magnification (labels via aria/title; active dot). */
export interface DockItem { icon: ReactNode; label: string; onSelect?: () => void; active?: boolean; }
export interface DockProps { items: DockItem[]; label?: string; className?: string; }
export const Dock: React.ForwardRefExoticComponent<
  DockProps & React.RefAttributes<HTMLElement>
>;
