import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Slides with prev/next arrows + dot nav (bilingual aria). children = slides.
 * Inactive slides are inert; empty/single collections disable navigation. */
export interface CarouselProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-roledescription" | "aria-label">;
  children?: ReactNode;
  startIndex?: number;
  /** Accessible carousel label. */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Carousel: React.ForwardRefExoticComponent<React.PropsWithoutRef<CarouselProps> & React.RefAttributes<HTMLDivElement>>;
