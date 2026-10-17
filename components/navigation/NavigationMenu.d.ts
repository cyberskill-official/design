/** Panel-link descriptions preserve numeric zero; null, false and empty strings omit the description. */
import type { ReactNode } from "react";

/** Site navigation with optional rich panels (mega-menu style). */
export interface NavPanelLink { label: ReactNode; desc?: ReactNode; href?: string; }
export type NavigationMenuItem = { label: ReactNode; href?: string; panel?: NavPanelLink[] };
export interface NavigationMenuProps { items: NavigationMenuItem[]; className?: string; }
export function NavigationMenu(props: NavigationMenuProps): React.ReactElement;
