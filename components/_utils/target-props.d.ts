import type * as React from "react";
/** Data attributes are supported on the explicitly named target. No ref contract is implied. */
export type DataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined };
export type RootTargetProps<E extends HTMLElement = HTMLDivElement> = Omit<React.HTMLAttributes<E>, "children" | "dangerouslySetInnerHTML"> & DataAttributes;
export type InputControlTargetProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "dangerouslySetInnerHTML" | "type" | "role" | "value" | "defaultValue" | "onChange" | "disabled" | "min" | "max" | "step" | "aria-haspopup" | "aria-expanded" | "aria-controls" | "aria-autocomplete" | "aria-activedescendant"> & DataAttributes;
export type ButtonControlTargetProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "dangerouslySetInnerHTML" | "type" | "role" | "aria-required" | "disabled" | "name" | "value" | "aria-haspopup" | "aria-expanded" | "aria-controls"> & DataAttributes;
