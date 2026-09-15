import type { ReactNode } from "react";

/** Discussion entry (avatar · author · meta · body · action row · nested
 *  replies). Default action is a bilingual "Reply". */
export interface CommentAction { label: ReactNode; onSelect?: () => void; }
export interface CommentProps {
  avatar?: ReactNode;
  author: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  actions?: CommentAction[];
  /** Nest further <Comment>s here. */
  replies?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Comment: React.ForwardRefExoticComponent<
  CommentProps & React.RefAttributes<HTMLElement>
>;
