import type * as React from "react";

/**
 * Avatar for Lumi, the golden-genie mascot. Pass `src` (the real mascot image,
 * e.g. assets/lumi-poster.webp) — otherwise it falls back to the ✦ "wish" glyph
 * on the golden gradient. Use for chat, assistants, and AI touchpoints.
 */
export interface LumiAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
  alt?: string;
}
export const LumiAvatar: React.ForwardRefExoticComponent<
  LumiAvatarProps & React.RefAttributes<HTMLElement>
>;
