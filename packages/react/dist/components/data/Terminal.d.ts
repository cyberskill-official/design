import type { ReactNode } from "react";

/** Command console: history + prompt input. onCommand(cmd) returns the output
 *  to print (string/node). Warm-dark chrome, mono type. */
export interface TerminalProps {
  title?: string;
  welcome?: ReactNode;
  onCommand?: (cmd: string) => ReactNode;
  prompt?: string;
  lang?: string;
  className?: string;
}
export const Terminal: React.ForwardRefExoticComponent<
  TerminalProps & React.RefAttributes<HTMLElement>
>;
