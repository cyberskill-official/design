import type { ReactNode } from "react";
import type * as React from "react";

/**
 * AI-native human-in-the-loop checkpoint: warning-bordered card with a risk
 * label, plain-language summary, optional reviewer, and Approve / Reject
 * actions. Risk is never communicated by colour alone.
 */
export interface HumanReviewGateProps {
  risk?: ReactNode;
  summary: ReactNode;
  reviewer?: ReactNode;
  approveLabel?: string;
  rejectLabel?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export function HumanReviewGate(props: HumanReviewGateProps): React.ReactElement;
