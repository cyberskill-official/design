/** Curated brand-swatch picker + custom hex input (never a raw free-picker UI). */
export interface ColorPickerProps {
  /** #RRGGBB. Default Ochre. */
  value?: string;
  onChange?: (hex: string) => void;
  /** Defaults to ten fixed literal swatches from this component, not the current
   * generated element packs. Does not adapt to the element axis. */
  swatches?: string[];
  label?: string;
  lang?: string;
  className?: string;
}
export function ColorPicker(props: ColorPickerProps): React.ReactElement;
