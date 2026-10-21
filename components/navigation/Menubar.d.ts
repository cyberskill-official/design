import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** Keyboard arrows navigate named submenus and restore focus on Escape. */
import type { ReactNode } from "react";

/** App-style horizontal menu bar; hover switches menus while one is open. */
export type MenubarItem = { label: ReactNode; onSelect?: () => void; danger?: boolean } | "-";
export interface MenubarMenu { label: ReactNode; items: MenubarItem[]; }
export interface MenubarProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-label" | "aria-labelledby">; menus: MenubarMenu[]; className?: string; "aria-label"?: string; "aria-labelledby"?: string; }
export const Menubar: React.ForwardRefExoticComponent<React.PropsWithoutRef<MenubarProps> & React.RefAttributes<HTMLDivElement>>;
