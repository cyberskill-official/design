import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** The caption slots preserve numeric zero; null/false/empty string omit those slots. */
import type { ReactNode } from "react";

/** Table whose first column expands nested child rows. Expansion buttons are
 * named by the localized action plus the rendered first-cell content. */
export interface TreeTableColumn<R = any> { key: string; header: ReactNode; render?: (row: R) => ReactNode; }
/** Keys must be unique across the full table, not only within one sibling set.
 * Expanded branch buttons reference their direct child rows using stable IDs. */
export interface TreeTableNode { key: string; children?: TreeTableNode[]; [field: string]: unknown; }
export interface TreeTableProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  columns: TreeTableColumn[];
  nodes: TreeTableNode[];
  caption?: ReactNode;
  defaultExpanded?: string[];
  lang?: string;
  className?: string;
}
export const TreeTable: React.ForwardRefExoticComponent<React.PropsWithoutRef<TreeTableProps> & React.RefAttributes<HTMLDivElement>>;
