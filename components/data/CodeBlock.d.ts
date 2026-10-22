import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";

/** Dark umber code panel (JetBrains Mono) with a filename/language bar and a
 *  copy-to-clipboard button. Set showBar=false for a bare block. */
export interface CodeBlockProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  code: string;
  filename?: string;
  /** Caller-provided code-language label. When omitted, the generic heading follows lang. */
  language?: string;
  showBar?: boolean;
  /** UI locale override; otherwise inherits the nearest language scope. Distinct from code language. */
  lang?: string;
  className?: string;
}
export const CodeBlock: React.ForwardRefExoticComponent<React.PropsWithoutRef<CodeBlockProps> & React.RefAttributes<HTMLDivElement>>;
