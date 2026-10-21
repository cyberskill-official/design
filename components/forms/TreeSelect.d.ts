import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps, ButtonControlTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";
import type { TreeNode } from "../data/Tree";

/** Field + popover Tree; selecting a LEAF sets the value (branches toggle). */
export interface TreeSelectProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
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
  id?: string;
  /** Explicit outer target; Rating/OTP use the same semantic group as controlProps. No ref forwarding. */
  rootProps?: RootTargetProps;
  /** Explicit primary target. Owned role, state, value and change handling cannot be replaced. */
  controlProps?: ButtonControlTargetProps;
  description?: ReactNode;
  error?: ReactNode;
  /** Field requirement semantics; does not add native submission serialization. */
  required?: boolean;

  /** Native button control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLButtonElement>;
}
export const TreeSelect: React.ForwardRefExoticComponent<React.PropsWithoutRef<TreeSelectProps> & React.RefAttributes<HTMLDivElement>>;
