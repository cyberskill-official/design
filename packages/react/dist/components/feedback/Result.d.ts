import type { ReactNode } from "react";

/** Full status view for page-level outcomes (submit success, error, 403/404-style
 *  states). Title defaults bilingually per status from the registry. */
export interface ResultProps {
  status?: "success" | "error" | "warning" | "info";
  title?: ReactNode;
  children?: ReactNode;
  /** Compose Buttons. */
  actions?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Result: React.ForwardRefExoticComponent<
  ResultProps & React.RefAttributes<HTMLElement>
>;
