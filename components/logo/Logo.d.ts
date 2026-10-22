import type * as React from "react";

/**
 * CyberSkill brand mark — the exact official master artwork (Umber ground,
 * Ochre genie figure). Use whenever a product is for or owned by CyberSkill;
 * never recreate, retype, or recolour it. For third-party tenants, swap the
 * tenant's own logo instead (do not use this mark to represent another company).
 */
/** Inherited children remain accepted for compatibility but are ignored: the official
 * SVG markup and its generated accessible title are owned by Logo. */
export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  /** Rendered width/height in px. Default 32. */
  size?: number;
  /** Accessible name. Default "CyberSkill". */
  title?: string;
  /** When true, the mark is decorative (aria-hidden, no title). */
  decorative?: boolean;
}

export const Logo: React.ForwardRefExoticComponent<React.PropsWithoutRef<LogoProps> & React.RefAttributes<SVGSVGElement>>;
