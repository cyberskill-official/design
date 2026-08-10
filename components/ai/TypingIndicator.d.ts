import type * as React from "react";

/** Three animated dots in a bubble — shown while Lumi composes a reply. Freezes
 *  under reduced-motion. */
export interface TypingIndicatorProps {
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function TypingIndicator(props: TypingIndicatorProps): React.ReactElement;
