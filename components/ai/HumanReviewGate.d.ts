import type { RootTargetProps } from "../_utils/target-props";
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
  /** Attributes for the existing section root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLElement>, "aria-label">;
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

export const HumanReviewGate: React.ForwardRefExoticComponent<React.PropsWithoutRef<HumanReviewGateProps> & React.RefAttributes<HTMLElement>>;
