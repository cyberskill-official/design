/** Light rich-text editor (contentEditable): bold · italic · bullet list.
 *  onChange receives schema-sanitized HTML. Bilingual toolbar labels.
 *
 *  Trust boundary (CDS-SEC-001): `defaultValue` and emitted HTML are sanitized
 *  to `EDITOR_SCHEMA` allowlisted tags (no attributes). Use `unsafeHtml` only
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

/** Allowlisted tags for Editor HTML (TASK-IMP-029 schema model). Re-exported from editor-schema.js. */
export const EDITOR_SCHEMA: {
  readonly tags: readonly string[];
  readonly attrs: Readonly<Record<string, never>>;
};

/** Sanitize HTML to EDITOR_SCHEMA. Safe for seed and onChange paths. */
export function sanitizeHtml(html: string | null | undefined): string;

export function Editor(props: EditorProps): React.ReactElement;
