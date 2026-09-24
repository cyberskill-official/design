import type * as React from "react";

/** Indeterminate loading spinner (brand-coloured; slows under reduced-motion). */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** px diameter. Default 20. */
  size?: number;
  /** Accessible label. Default "Loading". */
  label?: string;
}

export const Spinner: React.ForwardRefExoticComponent<
  SpinnerProps & React.RefAttributes<HTMLElement>
>;
