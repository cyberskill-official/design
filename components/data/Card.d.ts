/** The CardHeader title and subtitle slots preserve numeric zero; null/false/empty string omit those slots. */
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Warm content panel — 14px radius, 1px warm border, soft umber-tinted shadow.
 * Compose with CardHeader / CardBody / CardFooter. `interactive` defaults to a
 * hoverable button unless `as` overrides the tag; the caller owns custom-tag semantics; add `className="cs-surface-standard"` for a glass card.
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  interactive?: boolean;
  flat?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: ReactNode;
}
export const Card: React.ForwardRefExoticComponent<React.PropsWithoutRef<CardProps> & React.RefAttributes<Element>>;

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
}
export const CardHeader: React.ForwardRefExoticComponent<React.PropsWithoutRef<CardHeaderProps> & React.RefAttributes<HTMLDivElement>>;
export const CardBody: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>>;
export const CardFooter: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>>;
