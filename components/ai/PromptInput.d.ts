/** An explicit numeric 0 hint remains visible. null, false and empty strings omit the hint; only undefined selects the localized default. */
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * AI-native prompt box (the "make a wish" input). Enter submits, Shift+Enter
 * newlines; composition confirmation does not submit. Controlled via value,
 * otherwise uncontrolled even when onChange is supplied. Submission invokes
 * the caller callback. The default hint describes a Lumi-to-human handoff;
 * use it only when the consumer implements that workflow, otherwise supply
 * an accurate hint. Model replies and human review are consumer-owned.
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
