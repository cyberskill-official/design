import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";

/** Three animated dots in a bubble — shown while Lumi composes a reply. Freezes
 *  under reduced-motion. */
export interface TypingIndicatorProps {
  /** Attributes for the existing span root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLSpanElement>, "role" | "aria-label">;
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const TypingIndicator: React.ForwardRefExoticComponent<React.PropsWithoutRef<TypingIndicatorProps> & React.RefAttributes<HTMLSpanElement>>;
