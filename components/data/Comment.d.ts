import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** The avatar, meta and replies slots preserve numeric zero; null/false/empty string omit those slots. */
import type { ReactNode } from "react";

/** Discussion entry (avatar · author · meta · body · action row · nested
 *  replies). Default action is a bilingual "Reply". */
export interface CommentAction { label: ReactNode; onSelect?: () => void; }
export interface CommentProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
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
export const Comment: React.ForwardRefExoticComponent<React.PropsWithoutRef<CommentProps> & React.RefAttributes<HTMLDivElement>>;
