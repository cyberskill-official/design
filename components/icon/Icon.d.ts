import type * as React from "react";

export type IconName =
  | "close" | "sun" | "moon" | "arrow-right" | "check"
  | "sparkle" | "chat" | "sound-on" | "sound-off"
  | "search" | "sliders" | "upload" | "download" | "calendar"
  | "user" | "plus" | "trash" | "external" | "menu"
  | "chevron-down" | "chevron-up" | "chevron-left" | "chevron-right"
  | "edit" | "copy" | "info" | "alert-triangle" | "pin";

/**
 * CyberSkill line-icon renderer. One component drives the whole in-repo icon set
 * (no external icon library). Icons stroke with currentColor and size from the
 * --cs-icon-* tokens. Decorative by default; pass `label` to name it for AT.
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  /** Maps to --cs-icon-sm|md|lg. Default "md". */
  size?: "sm" | "md" | "lg";
  /** Accessible name; omit for decorative icons. */
  label?: string;
  strokeWidth?: number;
  className?: string;
}

export function Icon(props: IconProps): React.ReactElement;
