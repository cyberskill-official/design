import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";

/**
 * Determinate progress bar. Ochre fill by default; umber/success variants.
 * Always pass a `label` for assistive tech.
 */
export interface ProgressBarProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-valuenow" | "aria-valuemin" | "aria-valuemax" | "aria-label">;
  /** Numeric progress clamped to zero through the normalized maximum; fractions are retained in ARIA. */
  value?: number;
  /** Positive finite maximum. Nonpositive or nonfinite values fall back to 100. */
  max?: number;
  variant?: "ochre" | "umber" | "success";
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export const ProgressBar: React.ForwardRefExoticComponent<React.PropsWithoutRef<ProgressBarProps> & React.RefAttributes<HTMLDivElement>>;
