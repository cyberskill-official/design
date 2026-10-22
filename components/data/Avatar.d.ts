import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * User/entity avatar: image, or auto initials on the Umber ground. Sizes
 * sm/md/lg; `square` for org/app tiles. Compose several in an AvatarGroup.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Full name — used for the image alt + initials fallback. */
  name?: string;
  size?: "sm" | "md" | "lg";
  square?: boolean;
}
export const Avatar: React.ForwardRefExoticComponent<React.PropsWithoutRef<AvatarProps> & React.RefAttributes<HTMLSpanElement>>;

export interface AvatarGroupProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>; className?: string; children?: ReactNode; }
export const AvatarGroup: React.ForwardRefExoticComponent<React.PropsWithoutRef<AvatarGroupProps> & React.RefAttributes<HTMLDivElement>>;
