import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Segmented AI-confidence indicator. Pass a numeric `value` 0–1 or a `level`.
 * The level is always spelled out in words next to the bar — never colour alone.
 * Pair with AIDisclosureBadge / HumanReviewGate for full provenance.
 */
export interface ConfidenceMeterProps {
  value?: number;
  level?: "low" | "medium" | "high";
  segments?: number;
  label?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export function ConfidenceMeter(props: ConfidenceMeterProps): React.ReactElement;
