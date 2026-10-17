/** The caption slots preserve numeric zero; null/false/empty string omit those slots. */
import type { ReactNode } from "react";

/** Table whose first column expands nested child rows. Expansion buttons are
 * named by the localized action plus the rendered first-cell content. */
export interface TreeTableColumn<R = any> { key: string; header: ReactNode; render?: (row: R) => ReactNode; }
export interface TreeTableNode { key: string; children?: TreeTableNode[]; [field: string]: unknown; }
export interface TreeTableProps {
  columns: TreeTableColumn[];
  nodes: TreeTableNode[];
  caption?: ReactNode;
  defaultExpanded?: string[];
  lang?: string;
  className?: string;
}
export function TreeTable(props: TreeTableProps): React.ReactElement;
