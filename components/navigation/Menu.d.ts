import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type { RootTargetProps } from "../_utils/target-props";
/** MenuItem icon preserves numeric zero; null, false and empty strings omit the icon slot. */
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Dropdown menu anchored to a trigger. Uncontrolled by default (click to
 * toggle, outside-click / Escape to close) or controlled via open/onOpenChange.
 * Keyboard: ArrowDown/Up opens first/last item; roving arrows and typeahead navigate; Tab closes.
 * Compose MenuItem children; separate groups with `<div className="cs-menu__sep" />`.
 */
export interface MenuProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start; bottom-end when align="end". Existing align selects bottom-start/end when placement is omitted; viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  trigger: ReactNode;
  children?: ReactNode;
  align?: "start" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Menu: React.ForwardRefExoticComponent<React.PropsWithoutRef<MenuProps> & React.RefAttributes<HTMLDivElement>>;

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
  icon?: ReactNode;
}
export const MenuItem: React.ForwardRefExoticComponent<React.PropsWithoutRef<MenuItemProps> & React.RefAttributes<HTMLButtonElement>>;
