import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

export interface StepItem { title: ReactNode; body?: ReactNode; n?: ReactNode; }

/** Horizontal progress stepper (the "arc of a wish"). Steps before `current`
 *  render done (umber check), `current` is active (ochre), the rest are to-do. */
export interface StepsProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-label">;
  steps: StepItem[];
  /** Zero-based active index; steps.length marks every item done. Exposed as aria-current="step". */
  current?: number;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Steps: React.ForwardRefExoticComponent<React.PropsWithoutRef<StepsProps> & React.RefAttributes<HTMLDivElement>>;
