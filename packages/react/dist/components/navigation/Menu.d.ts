import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Dropdown menu anchored to a trigger. Uncontrolled by default (click to
 * toggle, outside-click / Escape to close) or controlled via open/onOpenChange.
 * Compose MenuItem children; separate groups with `<div className="cs-menu__sep" />`.
 */
export interface MenuProps {
  trigger: ReactNode;
  children?: ReactNode;
  align?: "start" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Menu: React.ForwardRefExoticComponent<
  MenuProps & React.RefAttributes<HTMLElement>
>;

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
  icon?: ReactNode;
}
export const MenuItem: React.ForwardRefExoticComponent<
  MenuItemProps & React.RefAttributes<HTMLElement>
>;
