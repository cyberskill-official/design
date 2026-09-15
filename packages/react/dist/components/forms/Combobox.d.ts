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
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Combobox: React.ForwardRefExoticComponent<
  ComboboxProps & React.RefAttributes<HTMLElement>
>;
