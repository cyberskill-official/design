/** Panel-link descriptions preserve numeric zero; null, false and empty strings omit the description. */
import type * as React from "react";
import type { ReactNode } from "react";

/** Site navigation with optional rich panels (mega-menu style). */
export interface NavPanelLink { label: ReactNode; desc?: ReactNode; href?: string; }
export type NavigationMenuItem = { label: ReactNode; href?: string; panel?: NavPanelLink[] };
export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> { items: NavigationMenuItem[]; className?: string; }
export function NavigationMenu(props: NavigationMenuProps): React.ReactElement;
