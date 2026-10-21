import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill List container. Compose ListItem children. */
export const List = React.forwardRef(function List({ className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return <div role="list" className={cx("cs-list", className)} {...props} ref={mergedNativeRef} >{children}</div>;
});
List.displayName = "List";

/** A row in a List: optional lead (icon/avatar), title, subtitle, trailing node. */
export const ListItem = React.forwardRef(function ListItem({ lead, title, subtitle, trail, onClick, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const interactive = !!onClick;
  const Tag = interactive ? "button" : "div";
  const row = (
    <Tag ref={interactive ? undefined : mergedNativeRef} type={Tag === "button" ? "button" : undefined} role={interactive ? undefined : "listitem"} className={cx("cs-list__item", interactive && "cs-list__item--button", className)} onClick={onClick} {...props}>
      {lead != null ? <span className="cs-list__lead">{lead}</span> : null}
      <span className="cs-list__main">
        {title != null ? <span className="cs-list__title">{title}</span> : null}
        {subtitle != null ? <span className="cs-list__sub">{subtitle}</span> : null}
        {children}
      </span>
      {trail != null ? <span className="cs-list__trail">{trail}</span> : null}
    </Tag>
  );
  return interactive ? <div role="listitem" ref={mergedNativeRef} >{row}</div> : row;
});
ListItem.displayName = "ListItem";
