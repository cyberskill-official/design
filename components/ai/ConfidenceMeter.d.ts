import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Segmented AI-confidence indicator. Pass a numeric `value` 0–1 or a `level`.
 * The level is always spelled out in words next to the bar — never colour alone.
 * Pair with AIDisclosureBadge / HumanReviewGate for disclosure and review
 * controls. Values and levels are caller-supplied; the component does not
 * calculate calibrated confidence, verify sources or establish approval.
 */
export interface ConfidenceMeterProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  value?: number;
  level?: "low" | "medium" | "high";
  /** Whole segment count; finite fractions round down, minimum 1. Zero and invalid/nonfinite or unrepresentable counts use 5. */
  segments?: number;
  /** Visible label; the meter name references this content and its localized level. */
  label?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export const ConfidenceMeter: React.ForwardRefExoticComponent<React.PropsWithoutRef<ConfidenceMeterProps> & React.RefAttributes<HTMLDivElement>>;
