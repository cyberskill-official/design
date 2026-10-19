/** Filterable single-select: text input + filtered listbox (ARIA combobox).
 *  Controlled: value/onChange. Keyboard: arrows · Enter · Escape. */
export interface ComboboxOption { value: string; label: string; }
export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Default from the bilingual registry ("Select or type…" / "Chọn hoặc nhập…"). */
  placeholder?: string;
  /** Accessible label for the input. */
  label?: string;
  /** External label element IDs for the combobox input and listbox. */
  "aria-labelledby"?: string;
  /** Disables the field and closes an open popup; reenabling does not reopen it. */
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function Combobox(props: ComboboxProps): React.ReactElement;
