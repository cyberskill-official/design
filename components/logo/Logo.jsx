import React from "react";
import { CS_LOGO_VIEWBOX, CS_LOGO_MARK_INNER } from "./logo-data.js";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill brand mark. Renders the EXACT official master artwork (Umber ground,
 * Ochre genie figure). Use whenever a product is for or owned by CyberSkill.
 * Do not recreate or recolour the mark.
 */
export function Logo({ size = 32, title = "CyberSkill", decorative = false, className, ...props }) {
  const safeTitle = String(title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return (
    <svg
      {...props}
      className={cx("cs-logo", className)}
      width={size}
      height={size}
      viewBox={CS_LOGO_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      dangerouslySetInnerHTML={{ __html: (decorative ? "" : `<title>${safeTitle}</title>`) + CS_LOGO_MARK_INNER }}
    />
  );
}
