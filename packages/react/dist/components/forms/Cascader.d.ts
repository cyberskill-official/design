import type { ReactNode } from "react";

/** Column-per-level hierarchy picker (province → district style). value is the
 *  key path; leaf selection commits. */
export interface CascaderNode { key: string; label: ReactNode; children?: CascaderNode[]; }
export interface CascaderProps {
  nodes: CascaderNode[];
  /** Selected key path, e.g. ["hcm","d1"]. */
  value?: string[];
  onChange?: (path: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  lang?: string;
  className?: string;
}
export const Cascader: React.ForwardRefExoticComponent<
  CascaderProps & React.RefAttributes<HTMLElement>
>;
