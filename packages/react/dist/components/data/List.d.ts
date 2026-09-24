import type * as React from "react";
import type { ReactNode } from "react";

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> { children?: ReactNode; }
export const List: React.ForwardRefExoticComponent<
  ListProps & React.RefAttributes<HTMLElement>
>;

/** A list row: lead (icon/avatar), title, subtitle, trailing node. Pass onClick
 *  to make it an interactive button row. */
export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  lead?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  trail?: ReactNode;
  onClick?: () => void;
}
export const ListItem: React.ForwardRefExoticComponent<
  ListItemProps & React.RefAttributes<HTMLElement>
>;
