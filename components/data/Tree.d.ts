import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Expandable hierarchy (APG tree: roving tabindex + arrow navigate/expand).
 *  Single-select via onSelect(key, node). */
/** Unique string keys, including the empty string, identify nodes across updates. */
export interface TreeNode { key: string; label: ReactNode; children?: TreeNode[]; }
export interface TreeProps {
  /** Attributes for the existing ul root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLUListElement>, "role" | "aria-label" | "aria-labelledby">;
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
export const Tree: React.ForwardRefExoticComponent<React.PropsWithoutRef<TreeProps> & React.RefAttributes<HTMLUListElement>>;
