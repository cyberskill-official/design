import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Two resizable panes with a draggable divider (pointer + arrow keys; bilingual aria). */
export interface SplitterProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  start: ReactNode;
  end: ReactNode;
  /** Initial start-pane %. Default 50. */
  initial?: number;
  min?: number;
  max?: number;
  /** Requested container height in px. Default 240. Coarse pointers retain a
   *  46px container minimum so the divider remains at least 44px after borders. */
  height?: number;
  lang?: string;
  className?: string;
}
export const Splitter: React.ForwardRefExoticComponent<React.PropsWithoutRef<SplitterProps> & React.RefAttributes<HTMLDivElement>>;
