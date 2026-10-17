import type * as React from "react";

/** Dark umber code panel (JetBrains Mono) with a filename/language bar and a
 *  copy-to-clipboard button. Set showBar=false for a bare block. */
export interface CodeBlockProps {
  code: string;
  filename?: string;
  /** Caller-provided code-language label. When omitted, the generic heading follows lang. */
  language?: string;
  showBar?: boolean;
  /** UI locale override; otherwise inherits the nearest language scope. Distinct from code language. */
  lang?: string;
  className?: string;
}
export function CodeBlock(props: CodeBlockProps): React.ReactElement;
