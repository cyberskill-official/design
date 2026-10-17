import type * as React from "react";
import type { ReactNode } from "react";

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> { children?: ReactNode; }
export function List(props: ListProps): React.ReactElement;

/** A list row: lead (icon/avatar), title, subtitle, trailing node. Pass onClick
 *  to make it an interactive button row within a listitem wrapper. */
export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  lead?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  trail?: ReactNode;
  onClick?: () => void;
}
export function ListItem(props: ListItemProps): React.ReactElement;
