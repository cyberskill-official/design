import type * as React from "react";
import type { ReactNode } from "react";

export interface BreadcrumbItem { label: ReactNode; href?: string; }

/**
 * Hierarchical navigation trail. The last item renders as the current page
 * (aria-current), the rest as links.
 */
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.ForwardRefExoticComponent<
  BreadcrumbProps & React.RefAttributes<HTMLElement>
>;
