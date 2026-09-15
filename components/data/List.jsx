import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill List container. Compose ListItem children. */
export const List = React.forwardRef(function List({ className, children, ...props }, forwardedRef) {
  return <div ref={forwardedRef} role="list" className={cx("cs-list", className)} {...props}>{children}</div>;
});

/** A row in a List: optional lead (icon/avatar), title, subtitle, trailing node. */
export const ListItem = React.forwardRef(function ListItem({ lead, title, subtitle, trail, onClick, children, className, ...props }, forwardedRef) {
  const interactive = !!onClick;
  const Tag = interactive ? "button" : "div";
  return (
    <Tag ref={forwardedRef} role="listitem" className={cx("cs-list__item", interactive && "cs-list__item--button", className)} onClick={onClick} {...props}>
      {lead != null ? <span className="cs-list__lead">{lead}</span> : null}
      <span className="cs-list__main">
        {title != null ? <span className="cs-list__title">{title}</span> : null}
        {subtitle != null ? <span className="cs-list__sub">{subtitle}</span> : null}
        {children}
      </span>
      {trail != null ? <span className="cs-list__trail">{trail}</span> : null}
    </Tag>
  );
});
