import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** Scroll-to-top button; renders after `threshold` px of scroll. Bilingual aria. Respects the live reduced-motion preference. */
export interface BackTopProps {
  /** Attributes for the existing button root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLButtonElement>, "type" | "aria-label">;
  /** Show after this many px. Default 320. */
  threshold?: number;
  label?: string;
  lang?: string;
  className?: string;
}
export const BackTop: React.ForwardRefExoticComponent<React.PropsWithoutRef<BackTopProps> & React.RefAttributes<HTMLButtonElement>>;
