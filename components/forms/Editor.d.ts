/** Light rich-text editor (contentEditable): bold · italic · bullet list.
 *  onChange receives sanitized HTML. Untrusted by default — see docs/trusted-html.md. */
export interface EditorProps {
  /** Initial HTML (uncontrolled). */
  defaultValue?: string;
  /** Controlled sanitized HTML. */
  value?: string;
  onChange?: (html: string) => void;
  /** px. Default 120. */
  minHeight?: number;
  lang?: string;
  className?: string;
}
export function Editor(props: EditorProps): React.ReactElement;
export function sanitizeHtml(html: string | null | undefined): string;
