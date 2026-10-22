import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

export type PromptSuggestion = string | { label: string; icon?: ReactNode };

/** Tappable "wish" starter chips shown above/inside a PromptInput or chat. */
export interface PromptSuggestionsProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  suggestions: PromptSuggestion[];
  onSelect?: (label: string) => void;
  className?: string;
}
export const PromptSuggestions: React.ForwardRefExoticComponent<React.PropsWithoutRef<PromptSuggestionsProps> & React.RefAttributes<HTMLDivElement>>;
