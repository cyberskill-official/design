/** The explicit label and item source slots preserve numeric zero; null/false/empty string omit those slots. */
import type * as React from "react";
import type { ReactNode } from "react";

export interface Citation { title: ReactNode; source?: ReactNode; href?: string; }

/** Numbered provenance list for AI output — pairs with AIDisclosureBadge to show
 *  what a response was grounded in. Rows link out when href is set. */
export interface CitationListProps {
  label?: ReactNode;
  items?: Citation[];
  /** Explicit locale, otherwise nearest DOM language scope (Vietnamese default). */
  lang?: string;
  className?: string;
}
export function CitationList(props: CitationListProps): React.ReactElement;
