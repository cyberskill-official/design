import type { ReactNode } from "react";

/** Two resizable panes with a draggable divider (pointer + arrow keys; bilingual aria). */
export interface SplitterProps {
  start: ReactNode;
  end: ReactNode;
  /** Initial start-pane %. Default 50. */
  initial?: number;
  min?: number;
  max?: number;
  /** px. Default 240. */
  height?: number;
  lang?: string;
  className?: string;
}
export const Splitter: React.ForwardRefExoticComponent<
  SplitterProps & React.RefAttributes<HTMLElement>
>;
