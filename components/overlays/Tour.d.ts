/** Step body preserves numeric zero; null, false and empty strings omit the body paragraph. */
import type { ReactNode } from "react";

/** Spotlight onboarding walkthrough: highlights each step's `target` selector
 *  with a cutout + a popover card. Bilingual Skip/Back/Next/Done. */
export interface TourStep { target: string; title: ReactNode; body?: ReactNode; }
export interface TourProps {
  /** Shrinking clamps the current index; empty steps hide the tour. Reopening starts at zero. */
  steps: TourStep[];
  open: boolean;
  onClose?: () => void;
  lang?: string;
  className?: string;
}
export function Tour(props: TourProps): React.ReactElement;
