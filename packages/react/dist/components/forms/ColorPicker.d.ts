/** Curated brand-swatch picker + custom hex input (never a raw free-picker UI). */
export interface ColorPickerProps {
  /** #RRGGBB. Default Ochre. */
  value?: string;
  onChange?: (hex: string) => void;
  /** Defaults to the Ngũ Hành accent set. */
  swatches?: string[];
  label?: string;
  lang?: string;
  className?: string;
}
export const ColorPicker: React.ForwardRefExoticComponent<
  ColorPickerProps & React.RefAttributes<HTMLElement>
>;
