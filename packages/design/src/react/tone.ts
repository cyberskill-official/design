/** Category tones tint and label things that differ only by kind (teams, tags, avatars). Tint and icon only: never text on the solid color. */
export type CategoryTone = 'blue' | 'amber' | 'teal' | 'magenta' | 'violet';
/** Status tones carry meaning, so always pair them with an icon and text. */
export type StatusTone = 'success' | 'warning' | 'danger' | 'info';
/** Every tone a toned component takes. `primary` is ink, `accent` is gold. */
export type Tone = 'primary' | 'accent' | StatusTone | CategoryTone;

const CATEGORY_TONES: readonly CategoryTone[] = ['blue', 'amber', 'teal', 'magenta', 'violet'];

/** A stable category tone for a key such as a name or a tag: the same key always gets the same tone, on the server and in the browser. */
export function toneFor(key: string): CategoryTone {
  let hash = 0;
  for (const char of key) hash = (Math.imul(hash, 31) + char.codePointAt(0)!) | 0;
  return CATEGORY_TONES[(hash >>> 0) % CATEGORY_TONES.length]!;
}
