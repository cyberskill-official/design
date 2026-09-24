import type * as React from "react";
import type { ReactNode } from "react";

/** Keyboard key hint (e.g. ⌘, K, Esc). Mono, subtle bottom border. */
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}
export const Kbd: React.ForwardRefExoticComponent<
  KbdProps & React.RefAttributes<HTMLElement>
>;
