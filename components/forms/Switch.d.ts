import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Accessible on/off toggle (`role="switch"`). Track fills Umber when on.
 * Use for instant-apply settings; use Checkbox inside forms that submit.
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
}

export function Switch(props: SwitchProps): React.ReactElement;
