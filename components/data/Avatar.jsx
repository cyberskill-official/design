import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Avatar — image or initials on Umber. sizes sm|md|lg; square variant. */
export function Avatar({ src, name = "", size = "md", square = false, className, ...props }) {
  const initials = name ? name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "";
  return (
    <span className={cx("cs-avatar", `cs-avatar--${size}`, square && "cs-avatar--square", className)} role={!src && name ? "img" : undefined} aria-label={!src && name ? name : undefined} title={name || undefined} {...props}>
      {src ? <img src={src} alt={name} /> : <span aria-hidden="true">{initials}</span>}
    </span>
  );
}

/** Overlapping row of Avatars. */
export function AvatarGroup({ className, children }) {
  return <div className={cx("cs-avatar-group", className)}>{children}</div>;
}
