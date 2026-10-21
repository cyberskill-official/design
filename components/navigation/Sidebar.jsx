import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Sidebar — vertical app-shell navigation. Compose NavItem children; optional label groups. */
export const Sidebar = React.forwardRef(function Sidebar({ label, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const labelId = React.useId();
  const hasLabel = Boolean(label) || label === 0;
  return (
    <nav className={cx("cs-sidebar", className)} aria-labelledby={hasLabel ? labelId : undefined} {...props} ref={mergedNativeRef} >
      {hasLabel ? <div id={labelId} className="cs-sidebar__label">{label}</div> : null}
      {children}
    </nav>
  );
});
Sidebar.displayName = "Sidebar";

/** A row in a Sidebar. Renders an <a> when href is set, else a <button>. */
export const NavItem = React.forwardRef(function NavItem({ icon, active = false, trail, href, onClick, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const Tag = href ? "a" : "button";
  return (
    <Tag type={Tag === "button" ? "button" : undefined} className={cx("cs-nav-item", active && "is-active", className)} href={href} aria-current={active ? "page" : undefined} onClick={onClick} {...props} ref={mergedNativeRef} >
      {(icon || icon === 0) ? <span className="cs-nav-item__icon">{icon}</span> : null}
      <span>{children}</span>
      {trail != null ? <span className="cs-nav-item__trail">{trail}</span> : null}
    </Tag>
  );
});
NavItem.displayName = "NavItem";
