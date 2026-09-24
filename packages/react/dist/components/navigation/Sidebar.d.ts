import type * as React from "react";
import type { ReactNode } from "react";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  label?: ReactNode;
  children?: ReactNode;
}
export const Sidebar: React.ForwardRefExoticComponent<
  SidebarProps & React.RefAttributes<HTMLElement>
>;

/** A sidebar row. Renders <a> when href is set, otherwise <button>. `active`
 *  applies the ochre-tint current state. */
export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  icon?: ReactNode;
  active?: boolean;
  trail?: ReactNode;
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
}
export const NavItem: React.ForwardRefExoticComponent<
  NavItemProps & React.RefAttributes<HTMLElement>
>;
