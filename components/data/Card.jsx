import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Card — warm panel (14px radius, soft shadow). Compose with CardHeader/Body/Footer. */
export const Card = React.forwardRef(function Card({ interactive = false, flat = false, as, className, children, ...props }, forwardedRef) {
  const Tag = as || (interactive ? "button" : "div");
  return (
    <Tag ref={forwardedRef} className={cx("cs-card", flat && "cs-card--flat", interactive && "cs-card--interactive", className)} {...props}>
      {children}
    </Tag>
  );
});
export const CardHeader = React.forwardRef(function CardHeader({ title, subtitle, children, className, ...props }, forwardedRef) {
  return (
    <div ref={forwardedRef} className={cx("cs-card__header", className)} {...props}>
      {title ? <h3 className="cs-card__title">{title}</h3> : null}
      {subtitle ? <p className="cs-card__subtitle">{subtitle}</p> : null}
      {children}
    </div>
  );
});
export const CardBody = React.forwardRef(function CardBody({ className, children, ...props }, forwardedRef) {
  return <div ref={forwardedRef} className={cx("cs-card__body", className)} {...props}>{children}</div>;
});
export const CardFooter = React.forwardRef(function CardFooter({ className, children, ...props }, forwardedRef) {
  return <div ref={forwardedRef} className={cx("cs-card__footer", className)} {...props}>{children}</div>;
});
