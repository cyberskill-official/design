/** Attribute-free HTML policy shared by Node and browsers. */
export const EDITOR_SCHEMA: {
  readonly tags: readonly string[];
  readonly attrs: Readonly<Record<string, never>>;
};
/** Output is safe only as HTML element content, not an attribute, URL or script. */
export function sanitizeHtml(html: string | null | undefined): string;
export function escapeEditorText(text: unknown): string;
