import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Warm hairline separator. `label` centres text between two rules; `vertical`
 * splits inline content (place inside a flex row).
 */
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  vertical?: boolean;
  /** Labelled horizontal separator content; numeric zero is retained. Empty/null/false use the unlabelled rule. */
  label?: ReactNode;
}

export function Divider(props: DividerProps): React.ReactElement;
