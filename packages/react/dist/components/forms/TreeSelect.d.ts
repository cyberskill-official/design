import type { TreeNode } from "../data/Tree";

/** Field + popover Tree; selecting a LEAF sets the value (branches toggle). */
export interface TreeSelectProps {
  nodes: TreeNode[];
  value?: string;
  onChange?: (key: string, node: TreeNode) => void;
  /** Default from the registry ("Select…" / "Chọn…"). */
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  lang?: string;
  className?: string;
}
export const TreeSelect: React.ForwardRefExoticComponent<
  TreeSelectProps & React.RefAttributes<HTMLElement>
>;
