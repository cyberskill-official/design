/** Click-to-edit text: view button ⇄ input. Enter/blur commits, Escape cancels.
 *  Controlled (value/onChange) or uncontrolled. Bilingual edit/empty labels. */
export interface InlineEditProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Accessible field name (appended to the edit label). */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const InlineEdit: React.ForwardRefExoticComponent<
  InlineEditProps & React.RefAttributes<HTMLElement>
>;
