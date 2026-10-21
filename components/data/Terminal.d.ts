import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Command console: history + prompt input. onCommand(cmd) returns the output
 *  to print (string/node). Warm-dark chrome, mono type. */
export interface TerminalProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  title?: string;
  welcome?: ReactNode;
  onCommand?: (cmd: string) => ReactNode;
  prompt?: string;
  lang?: string;
  className?: string;
}
export const Terminal: React.ForwardRefExoticComponent<React.PropsWithoutRef<TerminalProps> & React.RefAttributes<HTMLDivElement>>;
