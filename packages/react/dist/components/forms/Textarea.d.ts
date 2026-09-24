import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Multi-line text input in the CyberSkill field frame, with description + error
 * wiring identical to TextField. Vertically resizable; diacritic/IME-safe.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}

export const Textarea: React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLElement>
>;
