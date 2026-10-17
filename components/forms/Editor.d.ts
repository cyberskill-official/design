/** Light rich-text editor (contentEditable): bold · italic · bullet list.
 *  onChange receives schema-sanitized HTML. Bilingual toolbar labels.
 *
 *  Trust boundary (CDS-SEC-001): `defaultValue` and emitted HTML are sanitized
 *  to `EDITOR_SCHEMA` allowlisted tags (no attributes), using the same inert
 *  parser in Node and browsers. Paste/drop sanitize before DOM insertion.
 *  Toolbar actions support Enter/Space and preserve selection. Use `unsafeHtml` only
 *  for trusted markup that must bypass sanitization. */
export interface EditorProps {
  /** Initial HTML — sanitized before inject. Prefer this for untrusted or mixed sources. */
  defaultValue?: string;
  /**
   * Trusted HTML seed that bypasses sanitization. Do not pass user input here.
   * When set, takes precedence over `defaultValue` for the initial seed.
   */
  unsafeHtml?: string;
  onChange?: (html: string) => void;
  /** px. Default 120. */
  minHeight?: number;
  lang?: string;
  className?: string;
}

export function Editor(props: EditorProps): React.ReactElement;
