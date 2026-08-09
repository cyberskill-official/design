import type { ReactNode } from "react";

/** Horizontal action bar (APG toolbar: arrow-key roving among controls).
 *  Items after `overflowAfter` collapse into a ⋯ menubutton + popup menu
 *  (bilingual aria). "-" renders a separator. */
export type ToolbarItem = { label?: ReactNode; icon?: ReactNode; onSelect?: () => void } | "-";
export interface ToolbarProps {
  items: ToolbarItem[];
  /** Collapse items after this index into the ⋯ menu. */
  overflowAfter?: number;
  /** Accessible toolbar label. */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function Toolbar(props: ToolbarProps): React.ReactElement;
