import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Inline banner for contextual messages. Semantic variant sets the accent
 * border + default icon; pass `icon` to override. Meaning is carried by the
 * title/body text, never colour alone.
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
}

export function Alert(props: AlertProps): React.ReactElement;
