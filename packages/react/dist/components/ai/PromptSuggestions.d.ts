import type * as React from "react";
import type { ReactNode } from "react";

export type PromptSuggestion = string | { label: string; icon?: ReactNode };

/** Tappable "wish" starter chips shown above/inside a PromptInput or chat. */
export interface PromptSuggestionsProps {
  suggestions: PromptSuggestion[];
  onSelect?: (label: string) => void;
  className?: string;
}
export const PromptSuggestions: React.ForwardRefExoticComponent<
  PromptSuggestionsProps & React.RefAttributes<HTMLElement>
>;
