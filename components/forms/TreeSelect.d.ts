import type { TreeNode } from "../data/Tree";

/** Field + popover Tree; selecting a LEAF sets the value (branches toggle). */
export interface TreeSelectProps {
  nodes: TreeNode[];
  value?: string;
  onChange?: (key: string, node: TreeNode) => void;
  /** Default from the registry ("Select…" / "Chọn…"). */
  placeholder?: string;
  label?: string;
  /** External label element IDs for the trigger button and popup tree. */
  "aria-labelledby"?: string;
  /** Disables the field and closes an open popup; reenabling does not reopen it. */
  disabled?: boolean;
  lang?: string;
  className?: string;
}
export function TreeSelect(props: TreeSelectProps): React.ReactElement;
