import type * as React from "react";

/**
 * Determinate progress bar. Ochre fill by default; umber/success variants.
 * Always pass a `label` for assistive tech.
 */
export interface ProgressBarProps {
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

export function ProgressBar(props: ProgressBarProps): React.ReactElement;
