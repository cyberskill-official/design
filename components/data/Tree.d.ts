import type { ReactNode } from "react";

/** Expandable hierarchy (APG tree: roving tabindex + arrow navigate/expand).
 *  Single-select via onSelect(key, node). */
/** Unique string keys, including the empty string, identify nodes across updates. */
export interface TreeNode { key: string; label: ReactNode; children?: TreeNode[]; }
export interface TreeProps {
  nodes: TreeNode[];
  /** Accessible tree name; alternatively reference a visible heading. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  selected?: string;
  onSelect?: (key: string, node: TreeNode) => void;
  /** Expand all branches initially. Default false. */
  defaultOpen?: boolean;
  className?: string;
}
export function Tree(props: TreeProps): React.ReactElement;
