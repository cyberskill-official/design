import type * as React from "react";

/** Dark umber code panel (JetBrains Mono) with a filename/language bar and a
 *  copy-to-clipboard button. Set showBar=false for a bare block. */
export interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  showBar?: boolean;
  className?: string;
}
export const CodeBlock: React.ForwardRefExoticComponent<
  CodeBlockProps & React.RefAttributes<HTMLElement>
>;
