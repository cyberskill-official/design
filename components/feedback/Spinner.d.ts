import type * as React from "react";

/** Indeterminate loading spinner (brand-coloured; continuous spinning stops under reduced-motion). */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** px diameter. Default 20. */
  size?: number;
  /** Accessible label. Defaults to the EN/VI registry for the resolved language. */
  label?: string;
}

export const Spinner: React.ForwardRefExoticComponent<React.PropsWithoutRef<SpinnerProps> & React.RefAttributes<HTMLSpanElement>>;
