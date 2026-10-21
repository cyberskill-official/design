import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Avatar — image or initials on Umber. sizes sm|md|lg; square variant. */
export const Avatar = React.forwardRef(function Avatar({ src, name = "", size = "md", square = false, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const initials = name ? name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "";
  return (
    <span className={cx("cs-avatar", `cs-avatar--${size}`, square && "cs-avatar--square", className)} role={!src && name ? "img" : undefined} aria-label={!src && name ? name : undefined} title={name || undefined} {...props} ref={mergedNativeRef} >
      {src ? <img src={src} alt={name} /> : <span aria-hidden="true">{initials}</span>}
    </span>
  );
});
Avatar.displayName = "Avatar";

/** Overlapping row of Avatars. */
export const AvatarGroup = React.forwardRef(function AvatarGroup({ className, children , rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return <div {...mergeTargetProps({ "className": cx("cs-avatar-group", className) }, rootProps, [])} ref={mergedNativeRef} >{children}</div>;
});
AvatarGroup.displayName = "AvatarGroup";
