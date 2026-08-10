import type * as React from "react";
import type { ReactNode } from "react";

/**
 * AI-native prompt box (the "make a wish" input). Enter submits, Shift+Enter
 * newlines. Controlled via value/onChange or uncontrolled. Keep the disclosure
 * hint — it tells users a human reviews clear wishes.
 */
export interface PromptInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  sendLabel?: string;
  hint?: ReactNode;
  disabled?: boolean;
  busy?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export function PromptInput(props: PromptInputProps): React.ReactElement;
