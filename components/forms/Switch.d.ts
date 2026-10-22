/** A numeric 0 label remains visible and supplies the accessible name. Explicit ARIA naming retains precedence; absent/empty labels retain the localized fallback. */
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * On/off toggle (`role="switch"`). Checked track fills Umber in Light and
 * Ochre in Dark.
 * Use for instant-apply settings; use Checkbox inside forms that submit.
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
}

export const Switch: React.ForwardRefExoticComponent<React.PropsWithoutRef<SwitchProps> & React.RefAttributes<HTMLInputElement>>;
