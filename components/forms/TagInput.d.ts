/** Multi-value token input: Enter/comma adds a tag, Backspace removes the last,
 *  blur commits, duplicates ignored. Controlled (value/onChange) or uncontrolled. */
export interface TagInputProps {
  id?: string;
  /** Visible field label (associates via htmlFor). When omitted, the input uses the placeholder as aria-label. */
  label?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  /** Default from the bilingual registry ("Add a tag…" / "Thêm thẻ…"). */
  placeholder?: string;
  /** Max tag count. */
  max?: number;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function TagInput(props: TagInputProps): React.ReactElement;
