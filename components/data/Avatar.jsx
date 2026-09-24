import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Avatar — image or initials on Umber. sizes sm|md|lg; square variant. */
export const Avatar = React.forwardRef(function Avatar({ src, name = "", size = "md", square = false, className, ...props }, forwardedRef) {
  const initials = name ? name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "";
  return (
    <span ref={forwardedRef} className={cx("cs-avatar", `cs-avatar--${size}`, square && "cs-avatar--square", className)} title={name || undefined} {...props}>
      {src ? <img src={src} alt={name} /> : <span aria-hidden="true">{initials}</span>}
    </span>
  );
});

/** Overlapping row of Avatars. */
export const AvatarGroup = React.forwardRef(function AvatarGroup({ className, children }, forwardedRef) {
  return <div ref={forwardedRef} className={cx("cs-avatar-group", className)}>{children}</div>;
});
