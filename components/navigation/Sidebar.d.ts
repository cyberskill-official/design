/** The Sidebar label and NavItem icon slots preserve numeric zero; null/false/empty string omit those slots. */
import type * as React from "react";
import type { ReactNode } from "react";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  label?: ReactNode;
  children?: ReactNode;
}
export function Sidebar(props: SidebarProps): React.ReactElement;

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
export function NavItem(props: NavItemProps): React.ReactElement;
