import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** Step body preserves numeric zero; null, false and empty strings omit the body paragraph. */
import type { ReactNode } from "react";

/** Spotlight onboarding walkthrough: highlights each step's `target` selector
 *  with a cutout + a popover card. Bilingual Skip/Back/Next/Done. */
export interface TourStep { target: string; title: ReactNode; body?: ReactNode; }
export interface TourProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  /** Shrinking clamps the current index; empty steps hide the tour. Reopening starts at zero. */
  steps: TourStep[];
  open: boolean;
  onClose?: () => void;
  lang?: string;
  className?: string;
}
export const Tour: React.ForwardRefExoticComponent<React.PropsWithoutRef<TourProps> & React.RefAttributes<HTMLDivElement>>;
