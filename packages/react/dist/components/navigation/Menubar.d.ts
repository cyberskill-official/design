import type { ReactNode } from "react";

/** App-style horizontal menu bar; hover switches menus while one is open. */
export type MenubarItem = { label: ReactNode; onSelect?: () => void; danger?: boolean } | "-";
export interface MenubarMenu { label: ReactNode; items: MenubarItem[]; }
export interface MenubarProps { menus: MenubarMenu[]; className?: string; }
export const Menubar: React.ForwardRefExoticComponent<
  MenubarProps & React.RefAttributes<HTMLElement>
>;
