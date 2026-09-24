import type { ReactNode } from "react";

/** Brand-styled anchor. variant: default (underlined umber-ochre) | muted |
 *  standalone (bold + arrow). external opens a new tab with rel + ↗. */
export interface LinkProps {
  href?: string;
  variant?: "default" | "muted" | "standalone";
  external?: boolean;
  children?: ReactNode;
  className?: string;
}
export const Link: React.ForwardRefExoticComponent<
  LinkProps & React.RefAttributes<HTMLElement>
>;
