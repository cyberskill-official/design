import React from "react";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill Item — shared list / settings / nav row chrome.
 * Leading + trailing slots, title + description, selected / disabled, and
 * href (anchor) or onClick (button) when interactive.
 * When `title` is set and `trailing` is omitted, `children` render in the
 * trailing slot (handy for DC templates nesting a Switch).
 */
export function Item({
  leading,
  trailing,
  title,
  description,
  selected = false,
  disabled = false,
  href,
  onClick,
  children,
  className,
  ...props
}) {
  const interactive = !disabled && (href != null || typeof onClick === "function");
  const Tag = href != null && !disabled ? "a" : interactive ? "button" : "div";
  const rowProps = { ...props };
  if (Tag === "a") {
    rowProps.href = href;
    if (disabled) rowProps["aria-disabled"] = true;
  } else if (Tag === "button") {
    rowProps.type = "button";
    rowProps.disabled = disabled || undefined;
    rowProps.onClick = onClick;
  } else if (disabled) {
    rowProps["aria-disabled"] = true;
  }
  if (selected) rowProps["aria-current"] = rowProps["aria-current"] ?? "true";

  const trailExplicit = trailing !== undefined;
  const trailNode = trailExplicit ? trailing : title != null ? children : null;
  const mainExtra = trailExplicit ? children : title == null ? children : null;

  return (
    <Tag
      className={cx(
        "cs-item",
        interactive && "cs-item--interactive",
        selected && "is-selected",
        disabled && "is-disabled",
        className
      )}
      {...rowProps}
    >
      {leading != null ? <span className="cs-item__leading">{leading}</span> : null}
      <span className="cs-item__main">
        {title != null ? <span className="cs-item__title">{title}</span> : null}
        {description != null ? <span className="cs-item__description">{description}</span> : null}
        {mainExtra}
      </span>
      {trailNode != null && trailNode !== false ? <span className="cs-item__trailing">{trailNode}</span> : null}
    </Tag>
  );
}
