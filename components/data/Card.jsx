import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Card — warm panel (14px radius, soft shadow). Compose with CardHeader/Body/Footer. */
export const Card = React.forwardRef(function Card({ interactive = false, flat = false, as, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const Tag = as || (interactive ? "button" : "div");
  return (
    <Tag type={Tag === "button" ? "button" : undefined} className={cx("cs-card", flat && "cs-card--flat", interactive && "cs-card--interactive", className)} {...props} ref={mergedNativeRef} >
      {children}
    </Tag>
  );
});
Card.displayName = "Card";
export const CardHeader = React.forwardRef(function CardHeader({ title, subtitle, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return (
    <div className={cx("cs-card__header", className)} {...props} ref={mergedNativeRef} >
      {(title || title === 0) ? <h3 className="cs-card__title">{title}</h3> : null}
      {(subtitle || subtitle === 0) ? <p className="cs-card__subtitle">{subtitle}</p> : null}
      {children}
    </div>
  );
});
CardHeader.displayName = "CardHeader";
export const CardBody = React.forwardRef(function CardBody({ className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return <div className={cx("cs-card__body", className)} {...props} ref={mergedNativeRef} >{children}</div>;
});
CardBody.displayName = "CardBody";
export const CardFooter = React.forwardRef(function CardFooter({ className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return <div className={cx("cs-card__footer", className)} {...props} ref={mergedNativeRef} >{children}</div>;
});
CardFooter.displayName = "CardFooter";
