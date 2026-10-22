import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
/** Panel-link descriptions preserve numeric zero; null, false and empty strings omit the description. */
import type * as React from "react";
import type { ReactNode } from "react";

/** Site navigation with optional rich panels (mega-menu style). */
export interface NavPanelLink { label: ReactNode; desc?: ReactNode; href?: string; }
export type NavigationMenuItem = { label: ReactNode; href?: string; panel?: NavPanelLink[] };
export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement>, FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement; items: NavigationMenuItem[]; className?: string; }
export const NavigationMenu: React.ForwardRefExoticComponent<React.PropsWithoutRef<NavigationMenuProps> & React.RefAttributes<HTMLElement>>;
