import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Warm content panel — 14px radius, 1px warm border, soft umber-tinted shadow.
 * Compose with CardHeader / CardBody / CardFooter. `interactive` renders a
 * hoverable button; add `className="cs-surface-standard"` for a glass card.
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  interactive?: boolean;
  flat?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
}
export const Card: React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLElement>
>;

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  subtitle?: ReactNode;
}
export const CardHeader: React.ForwardRefExoticComponent<
  CardHeaderProps & React.RefAttributes<HTMLElement>
>;
export const CardBody: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLElement>
>;
export const CardFooter: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLElement>
>;
