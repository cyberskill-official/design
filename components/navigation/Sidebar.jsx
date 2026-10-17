import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Sidebar — vertical app-shell navigation. Compose NavItem children; optional label groups. */
export function Sidebar({ label, children, className, ...props }) {
  return (
    <nav className={cx("cs-sidebar", className)} {...props}>
      {(label || label === 0) ? <div className="cs-sidebar__label">{label}</div> : null}
      {children}
    </nav>
  );
}

/** A row in a Sidebar. Renders an <a> when href is set, else a <button>. */
export function NavItem({ icon, active = false, trail, href, onClick, children, className, ...props }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag type={Tag === "button" ? "button" : undefined} className={cx("cs-nav-item", active && "is-active", className)} href={href} aria-current={active ? "page" : undefined} onClick={onClick} {...props}>
      {(icon || icon === 0) ? <span className="cs-nav-item__icon">{icon}</span> : null}
      <span>{children}</span>
      {trail != null ? <span className="cs-nav-item__trail">{trail}</span> : null}
    </Tag>
  );
}
