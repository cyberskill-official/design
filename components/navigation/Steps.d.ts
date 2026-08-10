import type * as React from "react";
import type { ReactNode } from "react";

export interface StepItem { title: ReactNode; body?: ReactNode; n?: ReactNode; }

/** Horizontal progress stepper (the "arc of a wish"). Steps before `current`
 *  render done (umber check), `current` is active (ochre), the rest are to-do. */
export interface StepsProps {
  steps: StepItem[];
  current?: number;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function Steps(props: StepsProps): React.ReactElement;
