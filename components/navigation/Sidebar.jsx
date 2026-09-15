import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Sidebar — vertical app-shell navigation. Compose NavItem children; optional label groups. */
export const Sidebar = React.forwardRef(function Sidebar({ label, children, className, ...props }, forwardedRef) {
  return (
    <nav ref={forwardedRef} className={cx("cs-sidebar", className)} {...props}>
      {label ? <div className="cs-sidebar__label">{label}</div> : null}
      {children}
    </nav>
  );
});

/** A row in a Sidebar. Renders an <a> when href is set, else a <button>. */
export const NavItem = React.forwardRef(function NavItem({ icon, active = false, trail, href, onClick, children, className, ...props }, forwardedRef) {
  const Tag = href ? "a" : "button";
  return (
    <Tag ref={forwardedRef} className={cx("cs-nav-item", active && "is-active", className)} href={href} aria-current={active ? "page" : undefined} onClick={onClick} {...props}>
      {icon ? <span className="cs-nav-item__icon">{icon}</span> : null}
      <span>{children}</span>
      {trail != null ? <span className="cs-nav-item__trail">{trail}</span> : null}
    </Tag>
  );
});
