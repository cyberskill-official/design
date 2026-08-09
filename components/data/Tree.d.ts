import type { ReactNode } from "react";

/** Expandable hierarchy (APG tree: roving tabindex + arrow navigate/expand).
 *  Single-select via onSelect(key, node). */
export interface TreeNode { key: string; label: ReactNode; children?: TreeNode[]; }
export interface TreeProps {
  nodes: TreeNode[];
  selected?: string;
  onSelect?: (key: string, node: TreeNode) => void;
  /** Expand all branches initially. Default false. */
  defaultOpen?: boolean;
  className?: string;
}
export function Tree(props: TreeProps): React.ReactElement;
