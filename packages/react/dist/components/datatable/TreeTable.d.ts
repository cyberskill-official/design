import type { ReactNode } from "react";

/** Table whose first column expands nested child rows. */
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
export const TreeTable: React.ForwardRefExoticComponent<
  TreeTableProps & React.RefAttributes<HTMLElement>
>;
