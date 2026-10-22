import type * as React from "react";
import type { ReactNode } from "react";

/** In-page table of contents with scrollspy: highlights the section currently in
 *  view (IntersectionObserver; ochre rail marker). */
export interface AnchorItem { id: string; label: ReactNode; }
export interface AnchorProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  items: AnchorItem[];
  title?: ReactNode;
  className?: string;
}
export const Anchor: React.ForwardRefExoticComponent<React.PropsWithoutRef<AnchorProps> & React.RefAttributes<HTMLElement>>;
