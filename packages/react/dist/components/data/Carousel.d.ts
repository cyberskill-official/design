import type { ReactNode } from "react";

/** Slides with prev/next arrows + dot nav (bilingual aria). children = slides. */
export interface CarouselProps {
  children?: ReactNode;
  startIndex?: number;
  /** Accessible carousel label. */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Carousel: React.ForwardRefExoticComponent<
  CarouselProps & React.RefAttributes<HTMLElement>
>;
