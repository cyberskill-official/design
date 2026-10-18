/** Custom fallback content preserves numeric zero and rich React nodes. Null, false and empty strings retain the default error illustration. */
import type * as React from "react";
import type { ReactNode } from "react";

/** Image with loading shimmer, warm fallback on error, and optional
 *  click-to-preview lightbox (Escape/click closes). */
export interface ImageProps extends React.HTMLAttributes<HTMLElement> {
  /** Changing the source restarts loading and closes any preview. */
  src: string;
  alt?: string;
  /** CSS aspect-ratio, e.g. "16/9". */
  ratio?: string;
  /** Enables the click-to-zoom lightbox; disabling closes an open preview. */
  preview?: boolean;
  /** Custom fallback node when the image fails. */
  fallback?: ReactNode;
  /** Forwarded to the underlying <img>. */
  width?: number | string;
  /** Forwarded to the underlying <img>. */
  height?: number | string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function Image(props: ImageProps): React.ReactElement;
