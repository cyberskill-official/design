import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** Textarea with @user suggestions (native multiline textbox with a controlled suggestion listbox). */
export interface MentionsProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing span root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLSpanElement>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Usernames offered after "@". */
  users: string[];
  placeholder?: string;
  rows?: number;
  lang?: string;
  className?: string;
  "aria-label"?: string;
}
export const Mentions: React.ForwardRefExoticComponent<React.PropsWithoutRef<MentionsProps> & React.RefAttributes<HTMLTextAreaElement>>;
