import type * as React from "react";
import type { ReactNode } from "react";

/**
 * A single conversation turn with Lumi. role "lumi" (Ochre genie avatar,
 * left) or "user" (Umber, right). Override the avatar with the real mascot
 * image where available.
 */
export interface ChatMessageProps {
  role?: "lumi" | "user";
  name?: ReactNode;
  avatar?: ReactNode;
  children?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export function ChatMessage(props: ChatMessageProps): React.ReactElement;
