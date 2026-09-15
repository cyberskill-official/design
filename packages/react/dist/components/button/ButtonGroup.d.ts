import type { ReactNode } from "react";

/** Joins adjacent Buttons into one segmented cluster (shared borders, single
 *  rounded outline). Compose with <Button variant="secondary"> children. */
export interface ButtonGroupProps {
  children?: ReactNode;
  /** Accessible group label. */
  label?: string;
  className?: string;
}
export const ButtonGroup: React.ForwardRefExoticComponent<
  ButtonGroupProps & React.RefAttributes<HTMLElement>
>;
