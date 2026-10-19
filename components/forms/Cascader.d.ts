/** Collapsing a child column restores focus to its selected parent. */
import type { ReactNode } from "react";

/** Column-per-level hierarchy picker (province → district style). value is the
 *  key path; leaf selection commits. */
/** Rich labels render in options and the selected path; path separators are decorative. */
export interface CascaderNode { key: string; label: ReactNode; children?: CascaderNode[]; }
export interface CascaderProps {
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
}
export function Cascader(props: CascaderProps): React.ReactElement;
