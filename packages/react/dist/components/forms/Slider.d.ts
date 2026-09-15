import type * as React from "react";

/** Brand-tinted native range slider (Umber, Ochre in dark). Pass all native
 *  range props (min, max, step, value, defaultValue, onChange). */
export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
}
export const Slider: React.ForwardRefExoticComponent<
  SliderProps & React.RefAttributes<HTMLElement>
>;
