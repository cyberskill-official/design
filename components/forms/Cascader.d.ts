import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps, ButtonControlTargetProps } from "../_utils/target-props";
/** Collapsing a child column restores focus to its selected parent. */
import type { ReactNode } from "react";

/** Column-per-level hierarchy picker (province → district style). value is the
 *  key path; leaf selection commits. */
/** Rich labels render in options and the selected path; path separators are decorative. */
export interface CascaderNode { key: string; label: ReactNode; children?: CascaderNode[]; }
export interface CascaderProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  nodes: CascaderNode[];
  /** Selected key path, e.g. ["hcm","d1"]. */
  value?: string[];
  onChange?: (path: string[]) => void;
  placeholder?: string;
  label?: string;
  /** External label element IDs for the trigger button and listbox columns. */
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
export const Cascader: React.ForwardRefExoticComponent<React.PropsWithoutRef<CascaderProps> & React.RefAttributes<HTMLDivElement>>;
