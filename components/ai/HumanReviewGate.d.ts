/** The reviewer slots preserve numeric zero; null/false/empty string omit those slots. */
import type { ReactNode } from "react";
import type * as React from "react";

/**
 * Human-review control for an AI-assisted workflow: warning-bordered card with a risk
 * label, plain-language summary, optional reviewer, and Approve / Reject
 * actions. Risk is never communicated by colour alone. This UI invokes caller
 * callbacks; it does not authenticate reviewers, persist approval or enforce
 * authorization before an action. The consumer owns that workflow.
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
