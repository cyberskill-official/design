import type { ReactNode } from "react";
import type * as React from "react";

/**
 * AI-native disclosure pill (info-blue). Expands to explain what AI did and to
 * list sources — an explainability path, never decoration. Includes localized
 * default copy (EN + VN); deployment is consumer-owned. The caller supplies
 * accurate disclosure and sources. The UI does not detect AI involvement,
 * verify provenance or establish human approval.
 */
export interface AIDisclosureBadgeProps {
  label?: string;
  details?: ReactNode;
  sources?: string[];
  /** UI locale override; otherwise inherits the nearest language scope. */
  lang?: string;
  className?: string;
}

export function AIDisclosureBadge(props: AIDisclosureBadgeProps): React.ReactElement;
