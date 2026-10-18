import type * as React from "react";
import type { ReactNode } from "react";

/** Joins adjacent Buttons into one segmented cluster (shared borders, single
 *  rounded outline). Compose with <Button variant="secondary"> children. */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Accessible group label. */
  label?: string;
  className?: string;
}
export function ButtonGroup(props: ButtonGroupProps): React.ReactElement;
