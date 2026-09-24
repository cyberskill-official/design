import type { ReactNode } from "react";

/** Site navigation with optional rich panels (mega-menu style). */
export interface NavPanelLink { label: ReactNode; desc?: ReactNode; href?: string; }
export type NavigationMenuItem = { label: ReactNode; href?: string; panel?: NavPanelLink[] };
export interface NavigationMenuProps { items: NavigationMenuItem[]; className?: string; }
export const NavigationMenu: React.ForwardRefExoticComponent<
  NavigationMenuProps & React.RefAttributes<HTMLElement>
>;
