import type { ReactNode } from "react";

/** Spotlight onboarding walkthrough: highlights each step's `target` selector
 *  with a cutout + a popover card. Bilingual Skip/Back/Next/Done. */
export interface TourStep { target: string; title: ReactNode; body?: ReactNode; }
export interface TourProps {
  steps: TourStep[];
  open: boolean;
  onClose?: () => void;
  lang?: string;
  className?: string;
}
export const Tour: React.ForwardRefExoticComponent<
  TourProps & React.RefAttributes<HTMLElement>
>;
