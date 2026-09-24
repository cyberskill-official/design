import type { ReactNode } from "react";
import type * as React from "react";

/**
 * AI-native disclosure pill (info-blue). Expands to explain what AI did and to
 * list sources — an explainability path, never decoration. Ships localized copy
 * (EN + VN) in production.
 */
export interface AIDisclosureBadgeProps {
  label?: string;
  details?: ReactNode;
  sources?: string[];
  className?: string;
}

export const AIDisclosureBadge: React.ForwardRefExoticComponent<
  AIDisclosureBadgeProps & React.RefAttributes<HTMLElement>
>;
