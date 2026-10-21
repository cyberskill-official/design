import type * as React from "react";
import type { ReactNode } from "react";

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> { children?: ReactNode; }
export const List: React.ForwardRefExoticComponent<React.PropsWithoutRef<ListProps> & React.RefAttributes<HTMLDivElement>>;

/** A list row: lead (icon/avatar), title, subtitle, trailing node. Pass onClick
 *  to make it an interactive button row within a listitem wrapper. */
export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  lead?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  trail?: ReactNode;
  onClick?: () => void;
}
export const ListItem: React.ForwardRefExoticComponent<React.PropsWithoutRef<ListItemProps> & React.RefAttributes<HTMLDivElement>>;
